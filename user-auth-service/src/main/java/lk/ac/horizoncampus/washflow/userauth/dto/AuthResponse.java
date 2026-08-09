package lk.ac.horizoncampus.washflow.userauth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "Authentication response payload containing user info and token")
public class AuthResponse {

    @Schema(description = "Unique MongoDB ObjectId string of the user", example = "6a78577eb2193109129c047b")
    private String id;

    @Schema(description = "Full name of the user", example = "Jane Doe")
    private String name;

    @Schema(description = "Email address of the user", example = "jane.doe@washflow.com")
    private String email;

    @Schema(description = "Placeholder auth token", example = "b9bec5ca-d0f8-4859-870e-3eddd9e37036")
    private String token;
}
