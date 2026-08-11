package lk.ac.horizoncampus.washflow.laundry.repository;

import lk.ac.horizoncampus.washflow.laundry.model.LaundryService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LaundryServiceRepository extends MongoRepository<LaundryService, String> {
}
