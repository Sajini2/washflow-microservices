package lk.ac.horizoncampus.washflow.laundry.controller;

import jakarta.validation.Valid;
import lk.ac.horizoncampus.washflow.laundry.dto.CreateServiceRequest;
import lk.ac.horizoncampus.washflow.laundry.dto.ServiceResponse;
import lk.ac.horizoncampus.washflow.laundry.dto.UpdateServiceRequest;
import lk.ac.horizoncampus.washflow.laundry.service.LaundryServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class LaundryServiceController {

    private final LaundryServiceService laundryServiceService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("service", "laundry-service");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(laundryServiceService.getAll());
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable String id) {
        return ResponseEntity.ok(laundryServiceService.getById(id));
    }

    @PostMapping("/services")
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody CreateServiceRequest request) {
        ServiceResponse created = laundryServiceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable String id,
            @Valid @RequestBody UpdateServiceRequest request) {
        return ResponseEntity.ok(laundryServiceService.update(id, request));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        laundryServiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
