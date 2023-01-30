package com.example.teamActivity.message;

import com.example.clients.teamActivity.UpdateTeamActivityDTO;
import com.example.teamActivity.TeamActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.example.amqp.ExchangeKey.teamActivityQueue;

@Log4j2
@Component
@RequiredArgsConstructor
public class TeamActivityConsumer {

    private final TeamActivityService service;

    @RabbitListener(queues = teamActivityQueue)
    public void consumeUpdateEvent(UpdateTeamActivityDTO dto) {
        log.info("Consumed {} from queue", dto.toString());
        service.updateTeamActivity(dto);
    }
}
