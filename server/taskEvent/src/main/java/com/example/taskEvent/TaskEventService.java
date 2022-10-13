package com.example.taskEvent;

import static com.example.amqp.exchange.Notification.*;

import com.example.amqp.RabbitMqMessageProducer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskEventService {

  private final TaskEventRepository taskEventRepository;
  private final RabbitMqMessageProducer rabbitMQMessageProducer;
}
