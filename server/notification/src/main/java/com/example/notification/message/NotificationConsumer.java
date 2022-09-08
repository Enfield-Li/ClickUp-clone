package com.example.notification.message;

import static com.example.amqp.exchange.Notification.*;

import com.example.clients.notification.NotificationRequest;
import com.example.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class NotificationConsumer {

  private final NotificationService notificationService;

  @RabbitListener(queues = notificationQueue)
  public void consumer(NotificationRequest notificationRequest) {
    log.info("Consumed {} from queue", notificationRequest);
    notificationService.receive(notificationRequest);
  }
}
