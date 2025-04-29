package com.vlearning.KLTN_final.configuration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.nimbusds.jose.util.Base64;
import com.vlearning.KLTN_final.util.security.SecurityUtil;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Value("${jwt.base64-secret}")
    private String jwtKey;

    // hàm lấy key, key được lấy từ file môi trường (applications.property)
    private SecretKey getSecretKey() {
        /*
         * jwtKey là một chuỗi đã mã hóa Base64. Phương thức này dùng để giải mã chuỗi
         * này thành mảng byte để tạo ra một đối tượng SecretKey
         * 
         * Base64.from(jwtKey).decode(): Giải mã chuỗi jwtKey từ dạng Base64 thành mảng
         * byte.
         */
        byte[] keyBytes = Base64.from(jwtKey).decode();

        /*
         * SecretKeySpec: Đây là một lớp dùng để tạo đối tượng SecretKey từ mảng byte.
         * Bạn cần đối tượng này để sử dụng làm khóa bí mật cho thuật toán mã hóa của
         * JWT
         *
         * SecurityUtil.JWT_ALGORITHM.getName() trả về tên của thuật toán mã hóa
         */
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, SecurityUtil.JWT_ALGORITHM.getName());
    }

    // khai báo hình thức mã hóa JWT bằng cách khai báo key + thuật toán
    @Bean
    public JwtEncoder jwtEncoder() {
        return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    }

    // cấu hình giải mã json web token bằng cách cung cấp thông tin thuật toán
    @Bean
    public JwtDecoder jwtDecoder() {
        // lấy ra key
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITHM).build();
        // ghi đè lại function Jwt decode(String token) throws JwtException;
        return token -> {
            try {
                // giải mã token
                return jwtDecoder.decode(token);
            } catch (Exception e) {
                System.out.println(">>> JWT error: " + e.getMessage());
                throw e;
            }
        };
    }

    // khi decode-giải mã thành công
    @Bean
    // lấy data của jwt nạp vào authentication, lưu authentication vào spring
    // security context
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        /*
         * Tạo một JwtGrantedAuthoritiesConverter để chuyển đổi các quyền (authorities)
         * từ các claim trong JWT thành một danh sách các quyền mà Spring Security hiểu.
         */
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // Đặt prefix (tiền tố) cho các quyền truy cập được lấy từ JWT
        grantedAuthoritiesConverter.setAuthorityPrefix("");

        // ứng với claim có tên permission, nạp tất cả data của claim đó nạp vào
        // authentication
        /*
         * Thiết lập tên của claim trong JWT mà Spring Security sẽ dùng để lấy danh sách
         * các quyền hạn. Ở đây, bạn đã chỉ định là "permission", tức là Spring Security
         * sẽ lấy giá trị từ claim "permission" trong JWT để xác định các quyền hạn của
         * người dùng.
         */
        grantedAuthoritiesConverter.setAuthoritiesClaimName("permission");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(authz -> authz
                        // .requestMatchers(HttpMethod.GET, "/v1/login/google").authenticated()
                        .anyRequest().permitAll())

                // cấu hình jwt
                .oauth2ResourceServer((oauth2) -> oauth2
                        // tự động thêm BearerTokenAuthenticationFilter, nghĩa là khi truy cập api cần
                        // jwt(trừ permitall)
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(customAuthenticationEntryPoint)) // 401, không truyền, truyền sai lên
                                                                                   // token

                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173/google-login-success", true)
                // đăng nhập thành công redirect về FE, FE sẽ gọi lại endpoint v1/login/google

                )

                .formLogin(f -> f.disable())

                // cấu hình mô hình stateless -> đã thay đổi thành IF_REQUIRED cho phép Spring
                // Security tạo session khi cần thiết (ví dụ: khi đăng nhập google,OAuth2).
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        return http.build();
    }
}
