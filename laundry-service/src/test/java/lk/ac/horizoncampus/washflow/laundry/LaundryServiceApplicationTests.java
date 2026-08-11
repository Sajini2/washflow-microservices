package lk.ac.horizoncampus.washflow.laundry;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
    "spring.data.mongodb.uri=mongodb://localhost:27017/test_washflow_catalog"
})
class LaundryServiceApplicationTests {

    @Test
    void contextLoads() {
    }
}
