package com.vlearning.KLTN_final.util.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.vlearning.KLTN_final.domain.dto.response.UserAuth;

@Service
public class SecurityUtil {

    // thuật toán mã hóa
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    @Value("${jwt.base64-secret}")
    private String jwtKey;

    @Value("${jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    // @Value("${jwt.refresh-token-validity-in-seconds}")
    // private long refreshTokenExpiration;

    @Autowired
    private JwtEncoder jwtEncoder;

    public String createAccessToken(UserAuth user) {
        Instant currentTime = Instant.now();
        Instant validity = currentTime.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        // hardcode permission
        List<String> listAuthority = new ArrayList<String>();
        listAuthority.add(user.getRole());
        // listAuthority.add("ROOT");
        // listAuthority.add("ADMIN");
        // listAuthority.add("INSTRUCTOR");
        // listAuthority.add("STUDENT");

        // header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        // payload
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(currentTime)
                .expiresAt(validity)
                .subject(user.getEmail())
                .claim("user", user)
                // thêm 1 claim có tên permisson
                .claim("permission", listAuthority)
                .build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    /**
     * Get the login of the current user.
     *
     * @return the login of the current user.
     */
    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }
}
