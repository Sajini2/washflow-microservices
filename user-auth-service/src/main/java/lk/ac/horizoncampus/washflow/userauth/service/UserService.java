package lk.ac.horizoncampus.washflow.userauth.service;

import lk.ac.horizoncampus.washflow.userauth.dto.UpdateUserRequest;
import lk.ac.horizoncampus.washflow.userauth.dto.UserResponse;
import lk.ac.horizoncampus.washflow.userauth.exception.EmailAlreadyExistsException;
import lk.ac.horizoncampus.washflow.userauth.exception.UserNotFoundException;
import lk.ac.horizoncampus.washflow.userauth.model.User;
import lk.ac.horizoncampus.washflow.userauth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        return mapToUserResponse(user);
    }

    public UserResponse update(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (!user.getEmail().equalsIgnoreCase(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use: " + request.getEmail());
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
