package lk.ac.horizoncampus.washflow.userauth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private String id;
    private String name;
    private String email;
    private Instant createdAt;
}
