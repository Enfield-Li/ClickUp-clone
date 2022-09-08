package com.example.amqp;

import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class RabbitMqMessageProducer {

  @Autowired
  AmqpTemplate amqpTemplate;

  public void publish(String exchange, String routingKey, Object payload) {
    amqpTemplate.convertAndSend(exchange, routingKey, payload);

    log.info(
      "Published to {} using routingKey {} with payload: {}",
      exchange,
      routingKey,
      payload
    );
  }
}
