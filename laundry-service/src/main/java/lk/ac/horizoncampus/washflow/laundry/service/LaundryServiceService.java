package lk.ac.horizoncampus.washflow.laundry.service;

import lk.ac.horizoncampus.washflow.laundry.dto.CreateServiceRequest;
import lk.ac.horizoncampus.washflow.laundry.dto.ServiceResponse;
import lk.ac.horizoncampus.washflow.laundry.dto.UpdateServiceRequest;
import lk.ac.horizoncampus.washflow.laundry.exception.ServiceNotFoundException;
import lk.ac.horizoncampus.washflow.laundry.model.LaundryService;
import lk.ac.horizoncampus.washflow.laundry.repository.LaundryServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LaundryServiceService {

    private final LaundryServiceRepository laundryServiceRepository;

    public List<ServiceResponse> getAll() {
        return laundryServiceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ServiceResponse getById(String id) {
        LaundryService service = laundryServiceRepository.findById(id)
                .orElseThrow(() -> new ServiceNotFoundException(id));
        return mapToResponse(service);
    }

    public ServiceResponse create(CreateServiceRequest request) {
        LaundryService laundryService = LaundryService.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .estimatedMinutes(request.getEstimatedMinutes())
                .createdAt(Instant.now())
                .build();

        LaundryService saved = laundryServiceRepository.save(laundryService);
        return mapToResponse(saved);
    }

    public ServiceResponse update(String id, UpdateServiceRequest request) {
        LaundryService existing = laundryServiceRepository.findById(id)
                .orElseThrow(() -> new ServiceNotFoundException(id));

        if (request.getName() != null && !request.getName().isBlank()) {
            existing.setName(request.getName());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            existing.setPrice(request.getPrice());
        }
        if (request.getEstimatedMinutes() != null) {
            existing.setEstimatedMinutes(request.getEstimatedMinutes());
        }

        LaundryService updated = laundryServiceRepository.save(existing);
        return mapToResponse(updated);
    }

    public void delete(String id) {
        if (!laundryServiceRepository.existsById(id)) {
            throw new ServiceNotFoundException(id);
        }
        laundryServiceRepository.deleteById(id);
    }

    private ServiceResponse mapToResponse(LaundryService laundryService) {
        return ServiceResponse.builder()
                .id(laundryService.getId())
                .name(laundryService.getName())
                .description(laundryService.getDescription())
                .price(laundryService.getPrice())
                .estimatedMinutes(laundryService.getEstimatedMinutes())
                .createdAt(laundryService.getCreatedAt())
                .build();
    }
}
