package com.example.authorization.message;

import static com.example.amqp.ExchangeKey.AuthorizationQueue;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.example.authorization.AuthorizationService;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class AuthorizationConsumer {

    private final AuthorizationService authorizationService;

    @RabbitListener(queues = AuthorizationQueue)
    public void consumeUpdateEvent(UpdateUserJoinedTeamsDTO updateUserJoinedTeamsDTO) {
        log.info("Consumed {} from queue", updateUserJoinedTeamsDTO.toString());
        authorizationService.updateUserJoinedTeam(updateUserJoinedTeamsDTO);
    }
}
