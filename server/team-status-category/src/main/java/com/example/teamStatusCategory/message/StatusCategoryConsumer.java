package com.example.teamStatusCategory.message;

import com.example.teamStatusCategory.service.StatusCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.example.amqp.ExchangeKey.*;

@Log4j2
@Component
@RequiredArgsConstructor
public class StatusCategoryConsumer {

    private final StatusCategoryService statusCategoryService;

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = statusCategoryQueue),
            key = statusCategoryRoutingKey))
    public void consumeInitEvent(Integer teamId) {
        log.info("Consumed {} from queue", teamId);
        statusCategoryService.initDefaultStatusCategory(teamId);
    }
}
