<<<<<<<< HEAD:laundry-service/src/main/java/lk/ac/horizoncampus/washflow/laundry/LaundryServiceApplication.java
package lk.ac.horizoncampus.washflow.laundry;
========
package lk.ac.horizoncampus.washflow.orderpickup;
>>>>>>>> ccb5378 (feat: initialize order-pickup-service microservice and setup React client architecture with authentication context):order-pickup-service/src/main/java/lk/ac/horizoncampus/washflow/orderpickup/OrderPickupApplication.java

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LaundryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LaundryServiceApplication.class, args);
    }
}
