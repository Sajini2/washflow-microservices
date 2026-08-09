package lk.ac.horizoncampus.washflow.userauth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User profile response payload")
public class UserResponse {

    @Schema(description = "Unique MongoDB ObjectId string of the user", example = "6a78577eb2193109129c047b")
    private String id;

    @Schema(description = "Full name of the user", example = "Jane Doe")
    private String name;

    @Schema(description = "Email address of the user", example = "jane.doe@washflow.com")
    private String email;

    @Schema(description = "ISO-8601 timestamp when user was created", example = "2026-08-09T10:33:34.653Z")
    private Instant createdAt;
}
