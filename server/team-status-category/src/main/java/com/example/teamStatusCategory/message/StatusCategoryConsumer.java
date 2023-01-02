package com.example.teamStatusCategory.message;

import static com.example.amqp.ExchangeKey.statusCategoryQueue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.teamStatusCategory.service.StatusCategoryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class StatusCategoryConsumer {

    private final StatusCategoryService statusCategoryService;

    @RabbitListener(queues = statusCategoryQueue)
    public void consumeInitEvent(Integer teamId) {
        log.info("Consumed {} from queue", teamId);
        statusCategoryService.initDefaultStatusCategory(teamId);
    }
}
