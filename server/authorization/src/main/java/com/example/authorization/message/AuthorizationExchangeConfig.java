package com.example.authorization.message;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.example.amqp.ExchangeKey.*;

@Configuration
public class AuthorizationExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue authorizationQueue() {
        return new Queue(authorizationQueue);
    }

    @Bean
    public Binding internalToTaskEventBinding() {
        return BindingBuilder
                .bind(authorizationQueue())
                .to(internalTopicExchange())
                .with(authorizationRoutingKey);
    }
}
