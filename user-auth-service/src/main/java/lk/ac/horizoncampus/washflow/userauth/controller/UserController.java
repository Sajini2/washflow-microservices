package lk.ac.horizoncampus.washflow.userauth.controller;

import jakarta.validation.Valid;
import lk.ac.horizoncampus.washflow.userauth.dto.UpdateUserRequest;
import lk.ac.horizoncampus.washflow.userauth.dto.UserResponse;
import lk.ac.horizoncampus.washflow.userauth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getById(@PathVariable String id) {
        UserResponse response = userService.getById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> update(@PathVariable String id, @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.update(id, request);
        return ResponseEntity.ok(response);
    }
}
