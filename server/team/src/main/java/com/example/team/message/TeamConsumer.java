package com.example.team.message;

import com.example.clients.team.UpdateListCategoryDefaultStatusCategoryIdDTO;
import com.example.team.service.ListCategoryService;
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
public class TeamConsumer {

    private final ListCategoryService listCategoryService;

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = teamQueue),
            key = teamRoutingKey))
    public void consumeUpdateEvent(
            UpdateListCategoryDefaultStatusCategoryIdDTO dto) {
        log.info("Consumed {} from queue", dto.toString());
        listCategoryService.updateDefaultStatusCategoryId(dto);
    }
}
