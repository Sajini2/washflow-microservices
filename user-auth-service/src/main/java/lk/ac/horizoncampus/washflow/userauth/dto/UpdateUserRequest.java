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
@Schema(description = "User profile update request payload")
public class UpdateUserRequest {

    @Schema(description = "Updated full name of the user", example = "Jane Doe Updated")
    @NotBlank(message = "Name is required")
    private String name;

    @Schema(description = "Updated email address of the user", example = "jane.doe@washflow.com")
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;
}
