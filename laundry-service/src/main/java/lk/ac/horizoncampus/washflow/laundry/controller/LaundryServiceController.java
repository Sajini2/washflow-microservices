package lk.ac.horizoncampus.washflow.laundry.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lk.ac.horizoncampus.washflow.laundry.dto.CreateServiceRequest;
import lk.ac.horizoncampus.washflow.laundry.dto.ErrorResponse;
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
@Tag(name = "Laundry Services", description = "CRUD operations for laundry service types, pricing, and processing times")
public class LaundryServiceController {

    private final LaundryServiceService laundryServiceService;

    @GetMapping("/health")
    @Operation(summary = "Service Health Check", description = "Returns the operational status of the Laundry Service", security = {})
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Service is healthy")
    })
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("service", "laundry-service");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/services")
    @Operation(summary = "Get All Laundry Services", description = "Retrieves a list of all available laundry services")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of laundry services"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<ServiceResponse>> getAllServices() {
        return ResponseEntity.ok(laundryServiceService.getAll());
    }

    @GetMapping("/services/{id}")
    @Operation(summary = "Get Laundry Service by ID", description = "Retrieves details of a specific laundry service by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved laundry service"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Laundry service not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ServiceResponse> getServiceById(@PathVariable String id) {
        return ResponseEntity.ok(laundryServiceService.getById(id));
    }

    @PostMapping("/services")
    @Operation(summary = "Create Laundry Service", description = "Creates a new laundry service with name, description, price, and estimated processing time")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Laundry service successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or field validation failed", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ServiceResponse> createService(@Valid @RequestBody CreateServiceRequest request) {
        ServiceResponse created = laundryServiceService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/services/{id}")
    @Operation(summary = "Update Laundry Service", description = "Updates fields of an existing laundry service by ID (partial update)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Laundry service successfully updated"),
            @ApiResponse(responseCode = "400", description = "Invalid request payload or field validation failed", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Laundry service not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<ServiceResponse> updateService(
            @PathVariable String id,
            @Valid @RequestBody UpdateServiceRequest request) {
        return ResponseEntity.ok(laundryServiceService.update(id, request));
    }

    @DeleteMapping("/services/{id}")
    @Operation(summary = "Delete Laundry Service", description = "Deletes a laundry service by its ID")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Laundry service successfully deleted"),
            @ApiResponse(responseCode = "401", description = "Missing or invalid API key", content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Laundry service not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Void> deleteService(@PathVariable String id) {
        laundryServiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
