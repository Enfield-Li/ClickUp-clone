package com.example.notification;

import static com.example.amqp.exchange.NotificationExchange.*;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NotificationExchangeConfig {

  @Bean
  public TopicExchange internalTopicExchange() {
    return new TopicExchange(internalExchange);
  }

  @Bean
  public Queue notificationQueue() {
    return new Queue(notificationQueue);
  }

  @Bean
  public Binding internalToNotificationBinding() {
    return BindingBuilder
      .bind(notificationQueue())
      .to(internalTopicExchange())
      .with(notificationRoutingKey);
  }
}
