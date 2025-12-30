// package com.example.agro.config;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;

// import com.example.agro.services.CustomUserDetailsService;

// @Configuration
// public class SecurityConfig {

//     @Autowired
//     private JwtAuthenticationFilter jwtFilter;

//     @Autowired
//     private CustomUserDetailsService userDetailsService;

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//         return http
//                 .csrf(csrf -> csrf.disable())
//                 .cors(cors -> cors.configurationSource(req -> {
//                     var config = new CorsConfiguration();
//                     config.setAllowedOrigins(List.of("http://localhost:5173"));
//                     config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
//                     config.setAllowedHeaders(List.of("*"));
//                     return config;
//                 }))
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/api/auth/**").permitAll()
//                         .anyRequest().authenticated())
//                 .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authenticationProvider(authProvider())
//                 .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//                 .build();
//     }

//     @Bean
//     public DaoAuthenticationProvider authProvider() {
//         DaoAuthenticationProvider p = new DaoAuthenticationProvider();
//         p.setUserDetailsService(userDetailsService);
//         p.setPasswordEncoder(passwordEncoder());
//         return p;
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public AuthenticationManager authManager(AuthenticationConfiguration conf) throws Exception {
//         return conf.getAuthenticationManager();
//     }
// }


// 2


// package com.example.agro.config;

// import java.util.List;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;

// import com.example.agro.services.CustomUserDetailsService;

// @Configuration
// public class SecurityConfig {

//     @Autowired
//     private JwtAuthenticationFilter jwtFilter;

//     @Autowired
//     private CustomUserDetailsService userDetailsService;

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//         return http
//                 .csrf(csrf -> csrf.disable())
//                 .cors(cors -> cors.configurationSource(req -> {
//                     var config = new CorsConfiguration();
//                     config.setAllowedOrigins(List.of("http://localhost:5173"));
//                     config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
//                     config.setAllowedHeaders(List.of("*"));
//                     return config;
//                 }))
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/api/auth/**").permitAll()
//                         .anyRequest().authenticated())
//                 .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                 .authenticationProvider(authProvider())
//                 .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
//                 .build();
//     }

//     @Bean
//     public DaoAuthenticationProvider authProvider() {
//         // --- FIXED HERE ---
//         // Pass passwordEncoder() directly into the constructor
//         DaoAuthenticationProvider p = new DaoAuthenticationProvider(passwordEncoder());
//         p.setUserDetailsService(userDetailsService);
//         return p;
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     public AuthenticationManager authManager(AuthenticationConfiguration conf) throws Exception {
//         return conf.getAuthenticationManager();
//     }
// }


// 3

package com.example.agro.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

// Note: We don't need to inject UserDetailsService here anymore 
// because Spring finds it automatically for the global AuthenticationManager.

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(req -> {
                    var config = new CorsConfiguration();
                    config.setAllowedOrigins(List.of("http://localhost:5173"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                    config.setAllowedHeaders(List.of("*"));
                    return config;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // REMOVED: .authenticationProvider(authProvider()) 
                // Reason: Spring automatically configures the provider when it sees the beans below.
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // REMOVED: public DaoAuthenticationProvider authProvider() { ... }
    // Reason: This manual configuration caused the deprecation error and is redundant.

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration conf) throws Exception {
        return conf.getAuthenticationManager();
    }
}