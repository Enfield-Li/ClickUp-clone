package com.example.taskEvent.queue;

import static com.example.amqp.exchange.TaskEventExchange.*;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TaskEventExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(taskEventQueue);
    }

    @Bean
    public Binding internalToNotificationBinding() {
        return BindingBuilder
            .bind(notificationQueue())
            .to(internalTopicExchange())
            .with(taskEventRoutingKey);
    }
}
