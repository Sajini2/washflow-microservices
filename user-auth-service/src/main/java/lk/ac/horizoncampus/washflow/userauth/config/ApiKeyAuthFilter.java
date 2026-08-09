package lk.ac.horizoncampus.washflow.userauth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private static final String API_KEY_HEADER = "X-API-KEY";
    private static final String EXEMPT_ENDPOINT = "/health";

    private final String expectedApiKey;

    public ApiKeyAuthFilter(@Value("${service.api-key}") String expectedApiKey) {
        this.expectedApiKey = expectedApiKey;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // Exempt GET /health from API key check
        if (EXEMPT_ENDPOINT.equalsIgnoreCase(path) && "GET".equalsIgnoreCase(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKeyHeader = request.getHeader(API_KEY_HEADER);

        if (apiKeyHeader == null || !apiKeyHeader.equals(expectedApiKey)) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);

            String jsonResponse = String.format(
                    "{\"status\":401,\"message\":\"Missing or invalid API key\",\"timestamp\":\"%s\"}",
                    Instant.now().toString()
            );

            response.getWriter().write(jsonResponse);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
