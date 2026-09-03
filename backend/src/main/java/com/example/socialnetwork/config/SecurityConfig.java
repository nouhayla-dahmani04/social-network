// package com.example.socialnetwork.config;

// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
// import org.springframework.security.web.context.SecurityContextRepository;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public SecurityContextRepository securityContextRepository() {
//         return new HttpSessionSecurityContextRepository();
//     }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .cors(Customizer.withDefaults())
//             .authorizeHttpRequests(auth -> auth

//                 .requestMatchers("/api/auth/register", "/api/auth/login", "/api/auth/logout", "/ws/**").permitAll()
//                 .requestMatchers("/api/auth/me").authenticated()
//                 .anyRequest().authenticated()
//             )
//             .securityContext(context -> context
//                 .securityContextRepository(securityContextRepository())
//             )
//             .sessionManagement(sess -> sess
//                 .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
//             )
//             .exceptionHandling(ex -> ex
//                 .authenticationEntryPoint((req, res, authException) -> {
//                     res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                     res.setContentType("application/json");
//                     res.getWriter().write("{\"error\":\"Unauthorized\"}");
//                 })
//             )
//             .logout(logout -> logout
//                 .logoutUrl("/api/auth/logout")
//                 .invalidateHttpSession(true)
//                 .clearAuthentication(true)
//                 .deleteCookies("SESSION", "JSESSIONID")
//                 .logoutSuccessHandler((req, res, auth) -> {
//                     res.setStatus(HttpServletResponse.SC_OK);
//                     res.setContentType("application/json");
//                     res.getWriter().write("{\"message\":\"Logged out successfully\"}");
//                 })
//             );
//         return http.build();
//     }
// }
package com.example.socialnetwork.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.web.context.SecurityContextRepository securityContextRepository() {
        return new org.springframework.security.web.context.HttpSessionSecurityContextRepository();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .securityContext(context -> context.securityContextRepository(securityContextRepository()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/ws/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((req, res, auth) -> res.setStatus(200)));

        return http.build();
    }
}
