package com.example.team.message;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.example.amqp.ExchangeKey.*;

@Configuration
public class TeamExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue teamQueue() {
        return new Queue(teamQueue);
    }

    @Bean
    public Binding internalToTaskEventBinding() {
        return BindingBuilder
                .bind(teamQueue())
                .to(internalTopicExchange())
                .with(teamRoutingKey);
    }
}