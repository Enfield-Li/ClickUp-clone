package com.example.taskComment;

import static com.example.amqp.exchange.NotificationExchange.*;

import com.example.amqp.RabbitMqMessageProducer;
import com.example.clients.fraud.FraudCheckResponse;
// import com.example.clients.fraud.FraudClient;
import com.example.clients.notification.NotificationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class TaskCommentService {

    // private final RestTemplate restTemplate;
    private final TaskCommentRepository taskCommentRepository;
    private final RabbitMqMessageProducer rabbitMQMessageProducer;

    public void createComment() {
        rabbitMQMessageProducer.publish(
            internalExchange,
            notificationRoutingKey,
            1
        );
    }
}
