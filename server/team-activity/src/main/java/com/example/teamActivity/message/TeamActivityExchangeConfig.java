package com.example.teamActivity.message;

import static com.example.amqp.ExchangeKey.*;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TeamActivityExchangeConfig {

    @Bean
    public TopicExchange internalTopicExchange() {
        return new TopicExchange(internalExchange);
    }

    @Bean
    public Queue teamActivityQueue() {
        return new Queue(TeamActivityQueue);
    }

    @Bean
    public Binding internalToTaskEventBinding() {
        return BindingBuilder
                .bind(teamActivityQueue())
                .to(internalTopicExchange())
                .with(TeamActivityRoutingKey);
    }
}
