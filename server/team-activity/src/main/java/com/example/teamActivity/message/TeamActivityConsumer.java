package com.example.teamActivity.message;

import static com.example.amqp.ExchangeKey.TeamActivityQueue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.teamActivity.TeamActivityService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class TeamActivityConsumer {

    private final TeamActivityService service;

    @RabbitListener(queues = TeamActivityQueue)
    public void consumeUpdateEvent(UpdateTeamActivityDTO dto) {
        log.info("Consumed {} from queue", dto.toString());
        service.updateTeamActivity(dto);
    }
}
