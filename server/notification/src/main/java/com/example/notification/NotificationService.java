package com.example.notification;

import com.example.clients.notification.NotificationRequest;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

  private final NotificationRepository notificationRepository;

  public void receive(NotificationRequest notificationRequest) {
    notificationRepository.save(
      Notification
        .builder()
        .toCustomerId(notificationRequest.getToCustomerId())
        .toCustomerEmail(notificationRequest.getToCustomerName())
        .sender("user1")
        .message(notificationRequest.getMessage())
        .sentAt(LocalDateTime.now())
        .build()
    );
  }
}
