package com.example.teamActivity.message;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.example.amqp.ExchangeKey.*;

@Configuration
public class TeamActivityExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue teamActivityQueue() {
        return new Queue(teamActivityQueue);
    }

    @Bean
    public Binding internalToTaskEventBinding() {
        return BindingBuilder
                .bind(teamActivityQueue())
                .to(internalTopicExchange())
                .with(teamActivityRoutingKey);
    }
}
