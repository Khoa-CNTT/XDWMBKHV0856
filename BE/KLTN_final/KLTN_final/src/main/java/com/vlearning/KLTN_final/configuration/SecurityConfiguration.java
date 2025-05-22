package com.vlearning.KLTN_final.configuration;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
            CustomAccessDeniedHandler accessDeniedHandler) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(authz -> authz

                        // >>> storage
                        .requestMatchers(HttpMethod.GET, "/storage/**").permitAll()

                        // >>> module auth
                        .requestMatchers(HttpMethod.POST, "/v1/email/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/email/verify").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/admin-login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/oauth2/authorization/google").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/account").permitAll()

                        // >>> module user
                        .requestMatchers(HttpMethod.POST, "/v1/user").permitAll() // create user
                        .requestMatchers(HttpMethod.GET, "/v1/user/**").permitAll() // fetch user
                        .requestMatchers(HttpMethod.GET, "/v1/user-details/**").permitAll() // fetch user details
                        .requestMatchers(HttpMethod.GET, "/v1/users/**").permitAll() // fetch several users
                        .requestMatchers(HttpMethod.DELETE, "/v1/user/**").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/users").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PUT, "/v1/user")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.password").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.active/**")
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.protect/**")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.background/**")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.avatar/**")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/user.field").permitAll()
                        .requestMatchers(HttpMethod.POST, "/v1/user.skill").permitAll()
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.field/**")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/user.skill/**")
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/instructor-register").hasAuthority("STUDENT")

                        // >>> module field
                        .requestMatchers(HttpMethod.POST, "/v1/field").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/field/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/fields/**").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/v1/field").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/field/**").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/fields").hasAnyAuthority("ADMIN", "ROOT")

                        // >>> module skill
                        .requestMatchers(HttpMethod.POST, "/v1/skill").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/skill/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/v1/skills").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/v1/skill").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/skill/**").hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/skills").hasAnyAuthority("ADMIN", "ROOT")

                        // >>> module course
                        .requestMatchers(HttpMethod.POST, "/v1/course") // create course
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/course/**").permitAll() // fetch course
                        .requestMatchers(HttpMethod.GET, "/v1/course-details/**").permitAll() // fetch course details
                        .requestMatchers(HttpMethod.GET, "/v1/courses/**").permitAll() // fetch several courses
                        // update course
                        .requestMatchers(HttpMethod.PUT, "/v1/course").hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/course/**") // delete course
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/course.active/**") // update course active
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/course.image/**") // update course image
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/course.status/**") // update course status
                        .hasAnyAuthority("ADMIN", "ROOT")

                        // >>> module chapter
                        .requestMatchers(HttpMethod.POST, "/v1/chapter") // create chapter
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/chapter/**").permitAll() // fetch chapter
                        .requestMatchers(HttpMethod.PUT, "/v1/chapter") // UPDATE chapter
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/chapter/**") // DELETE CHAPTER
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> module lecture
                        .requestMatchers(HttpMethod.POST, "/v1/lecture") // create lecture
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/lecture/**").permitAll() // fetch lecture
                        .requestMatchers(HttpMethod.PUT, "/v1/lecture") // UPDATE lecture
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/lecture/**") // DELETE lecture
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/lecture.file/**") // update lecture file
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/lecture.process") // update lecture process
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/check-lecture.process") // CHECK lecture process
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> module order
                        .requestMatchers(HttpMethod.POST, "/v1/order") // create order
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/order/**").permitAll() // fetch order
                        .requestMatchers(HttpMethod.GET, "/v1/orders/**").permitAll() // fetch several orders
                        .requestMatchers(HttpMethod.GET, "/v1/order").permitAll() // fetch order by buyer and course id

                        // >>> module review
                        .requestMatchers(HttpMethod.POST, "/v1/review") // create review
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/review/**").permitAll() // fetch review
                        .requestMatchers(HttpMethod.GET, "/v1/reviews/**").permitAll() // fetch several reviews
                        .requestMatchers(HttpMethod.PUT, "/v1/review") // UPDATE REVIEW
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/review/**") // delete REVIEW
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> module file
                        .requestMatchers(HttpMethod.POST, "/v1/file/upload").hasAuthority("ROOT") // upload file

                        // >>> module wishlist
                        .requestMatchers(HttpMethod.POST, "/v1/wishlist") // add to wishlist
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/wishlist/**") // FETCH WISHLIST BY USER ID
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/wishlist") // remove from wishlist
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> module coupon
                        .requestMatchers(HttpMethod.POST, "/v1/coupon") // create coupon
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/coupon/**") // fetch coupon
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/coupons/**") // fetch several coupons
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.DELETE, "/v1/coupon/**") // delete coupon
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PUT, "/v1/coupon") // update coupon
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/release-coupon") // RELEASE coupon
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/user-coupon/**") // fetch user coupon
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> module payos payment
                        .requestMatchers(HttpMethod.POST, "/v1/payos/multiple-checkout") // create multiple payment
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/payos/single-checkout") // create single payment
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")

                        // >>> wallet module
                        .requestMatchers(HttpMethod.GET, "/v1/wallet/**") // fetch wallet by user id
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PUT, "/v1/wallet/**") // UPDATE WALLET
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/send-withdraw") // CREATE WITHDRAW REQUEST
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/withdraw/**") // FETCH WITHDRAW REQUEST
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/withdraws/**") // FETCH several WITHDRAW REQUEST
                        .hasAnyAuthority("INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.POST, "/v1/create-withdraw-payment") // CREATE QR by wq id
                        .hasAnyAuthority("ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.PATCH, "/v1/withdraw.status") // update wq status
                        .hasAnyAuthority("ADMIN", "ROOT")

                        // >>> log module
                        .requestMatchers(HttpMethod.POST, "/v1/log") // CREATE log
                        .hasAnyAuthority("STUDENT", "INSTRUCTOR", "ADMIN", "ROOT")
                        .requestMatchers(HttpMethod.GET, "/v1/logs") // fetch several logs
                        .hasAnyAuthority("ADMIN", "ROOT")

                // .anyRequest().permitAll()
                )

                // cấu hình jwt
                .oauth2ResourceServer((oauth2) -> oauth2
                        // tự động thêm BearerTokenAuthenticationFilter, nghĩa là khi truy cập api cần
                        // jwt(trừ permitall)
                        .jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(customAuthenticationEntryPoint)) // 401, không truyền, truyền sai lên
                                                                                   // token

                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(accessDeniedHandler))

                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173/google-login-success", true)
                // đăng nhập thành công redirect về FE, FE sẽ phải gọi lại endpoint
                // v1/login/google

                )

                .formLogin(f -> f.disable())

                // cấu hình mô hình stateless -> đã thay đổi thành IF_REQUIRED cho phép Spring
                // Security tạo session khi cần thiết (ví dụ: khi đăng nhập google,OAuth2).
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));

        return http.build();
    }
}
