package lk.ac.horizoncampus.washflow.laundry.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;

@Component
public class ApiKeyAuthFilter implements Filter {

    private static final String API_KEY_HEADER = "X-API-KEY";
    private static final String HEALTH_PATH    = "/health";

    @Value("${service.api-key}")
    private String configuredApiKey;

    @Override
    public void doFilter(ServletRequest servletRequest,
                         ServletResponse servletResponse,
                         FilterChain chain) throws IOException, ServletException {

        HttpServletRequest  request  = (HttpServletRequest)  servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        String path = request.getRequestURI();

        // Exempt GET /health -- no API key required
        if ("GET".equalsIgnoreCase(request.getMethod()) && HEALTH_PATH.equals(path)) {
            chain.doFilter(request, response);
            return;
        }

        String providedKey = request.getHeader(API_KEY_HEADER);

        if (providedKey == null || !providedKey.equals(configuredApiKey)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String body = String.format(
                    "{\"status\":401,\"message\":\"Missing or invalid API key\",\"timestamp\":\"%s\"}",
                    Instant.now().toString()
            );
            response.getWriter().write(body);
            return;
        }

        chain.doFilter(request, response);
    }
}
