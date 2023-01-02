package com.example.teamStatusCategory.message;

import static com.example.amqp.ExchangeKey.*;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StatusCategoryExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue statusCategoryQueue() {
        return new Queue(statusCategoryQueue);
    }

    @Bean
    public Binding internalToTaskEventBinding() {
        return BindingBuilder
                .bind(statusCategoryQueue())
                .to(internalTopicExchange())
                .with(statusCategoryRoutingKey);
    }
}
