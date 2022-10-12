package com.example.taskEvent;

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
public class TaskEventService {

  private final FraudClient fraudClient;
  private final RestTemplate restTemplate;
  private final TaskEventRepository customerRepository;
  private final RabbitMqMessageProducer rabbitMQMessageProducer;
}
