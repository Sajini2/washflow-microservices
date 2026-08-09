package lk.ac.horizoncampus.washflow.userauth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "User registration request payload")
public class RegisterRequest {

    @Schema(description = "Full name of the user", example = "Jane Doe")
    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "Email address of the user", example = "jane.doe@washflow.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Schema(description = "Password (minimum 6 characters)", example = "securepassword123")
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
}
