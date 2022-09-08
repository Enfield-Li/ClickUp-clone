package com.example.amqp;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

  @Bean
  public MessageConverter jacksonConverter() {
    return new Jackson2JsonMessageConverter();
  }

  @Bean
  public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
    RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
    rabbitTemplate.setMessageConverter(jacksonConverter());
    return rabbitTemplate;
  }
  //   @Bean
  //   public CachingConnectionFactory connectionFactory() {
  //     return new CachingConnectionFactory();
  //   }
  //   @Bean
  //   public SimpleRabbitListenerContainerFactory simpleRabbitListenerContainerFactory(
  //     ConnectionFactory connectionFactory
  //   ) {
  //     SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
  //     factory.setConnectionFactory(connectionFactory);
  //     factory.setMessageConverter(jacksonConverter());
  //     return factory;
  //   }
}
