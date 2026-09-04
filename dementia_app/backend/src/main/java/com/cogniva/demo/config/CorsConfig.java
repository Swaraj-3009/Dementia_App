package com.cogniva.demo.config;

import org.springframework.context.annotation.Configuration;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private static final String CAREGIVER_ID = "CAREGIVER_ID";

    @org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://127.0.0.1:5500,http://localhost:5500}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(Arrays.stream(allowedOrigins.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.isEmpty())
                        .toArray(String[]::new))
                .allowedMethods(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new HandlerInterceptor() {
            @Override
            public boolean preHandle(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    Object handler) throws java.io.IOException {

                if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
                    return true;
                }

                var session = request.getSession(false);
                if (session != null &&
                        session.getAttribute(CAREGIVER_ID) instanceof Long) {
                    return true;
                }

                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Authentication required.");
                return false;
            }
        }).addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**");
    }
}
