package com.example.teamStatusColumn.message;

import static com.example.amqp.ExchangeKey.teamStatusColumnQueue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.teamStatusColumn.TeamStatusColumnService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class TeamStatusColumnConsumer {

    private final TeamStatusColumnService teamStatusColumnService;

    @RabbitListener(queues = teamStatusColumnQueue)
    public void consumeInitEvent(Integer teamId) {
        log.info("Consumed {} from queue", teamId);
        teamStatusColumnService.initDefaultTeamStatusColumn(teamId);
    }
}
