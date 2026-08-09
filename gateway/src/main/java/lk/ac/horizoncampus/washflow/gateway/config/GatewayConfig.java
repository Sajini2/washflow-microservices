package lk.ac.horizoncampus.washflow.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Value("${internal.user-auth-service-api-key:washflow-user-auth-dev-key-2026}")
    private String userAuthApiKey;

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-auth-service-auth", r -> r.path("/auth/**")
                        .filters(f -> f.addRequestHeader("X-API-KEY", userAuthApiKey))
                        .uri("http://localhost:8081"))
                .route("user-auth-service-users", r -> r.path("/users/**")
                        .filters(f -> f.addRequestHeader("X-API-KEY", userAuthApiKey))
                        .uri("http://localhost:8081"))
                .route("laundry-service", r -> r.path("/services/**")
                        .filters(f -> f.addRequestHeader("X-API-KEY", "washflow-laundry-dev-key-2026"))
                        .uri("http://localhost:8082"))
                .route("order-pickup-service", r -> r.path("/orders/**")
                        .filters(f -> f.addRequestHeader("X-API-KEY", "washflow-order-pickup-dev-key-2026"))
                        .uri("http://localhost:8083"))
                .build();
    }
}
