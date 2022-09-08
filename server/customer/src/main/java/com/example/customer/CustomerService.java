package com.example.customer;

import static com.example.amqp.exchange.Notification.*;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.fraud.FraudCheckResponse;
import com.example.clients.fraud.FraudClient;
import com.example.clients.notification.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class CustomerService {

  private final FraudClient fraudClient;
  private final RestTemplate restTemplate;
  private final CustomerRepository customerRepository;
  private final RabbitMqMessageProducer rabbitMQMessageProducer;

  public void registerCustomer(CustomerRegistrationRequest request) {
    Customer customer = Customer
      .builder()
      .username(request.getUsername())
      .email(request.getPassword())
      .build();

    customerRepository.saveAndFlush(customer);
    // Customer savedCustomer = customerRepository.save(customer);

    FraudCheckResponse fraudCheckResponse = fraudClient.isFraudster(
      customer.getId()
    );
    // FraudCheckResponse fraudcheckRespose = restTemplate.getForObject(
    //   "http://FRAUD-SERVICE/api/v1/fraud-check/{customerId}",
    //   FraudCheckResponse.class,
    //   customer.getId()
    // );

    if (fraudCheckResponse.getIsFraudster()) {
      throw new IllegalStateException("fraudster");
    }

    NotificationRequest notificationPayload = new NotificationRequest(
      customer.getId(),
      customer.getEmail(),
      String.format("Hi %s, welcome ", customer.getUsername())
    );

    rabbitMQMessageProducer.publish(
      internalExchange,
      notificationRoutingKey,
      notificationPayload
    );
  }
}
