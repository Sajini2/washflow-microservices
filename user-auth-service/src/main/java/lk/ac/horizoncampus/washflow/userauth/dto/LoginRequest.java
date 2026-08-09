package lk.ac.horizoncampus.washflow.userauth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User login request payload")
public class LoginRequest {

    @Schema(description = "Email address of the user", example = "jane.doe@washflow.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Schema(description = "User password", example = "securepassword123")
    @NotBlank(message = "Password is required")
    private String password;
}
