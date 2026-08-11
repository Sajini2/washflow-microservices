package lk.ac.horizoncampus.washflow.laundry.exception;

public class ServiceNotFoundException extends RuntimeException {

    public ServiceNotFoundException(String id) {
        super("Laundry service not found with id: " + id);
    }
}
