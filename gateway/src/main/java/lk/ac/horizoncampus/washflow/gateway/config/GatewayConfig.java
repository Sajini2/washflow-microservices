package lk.ac.horizoncampus.washflow.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("user-auth-service-auth", r -> r.path("/auth/**")
                        .uri("http://localhost:8081"))
                .route("user-auth-service-users", r -> r.path("/users/**")
                        .uri("http://localhost:8081"))
                .route("laundry-service", r -> r.path("/services/**")
                        .uri("http://localhost:8082"))
                .route("order-pickup-service", r -> r.path("/orders/**")
                        .uri("http://localhost:8083"))
                .build();
    }
}
