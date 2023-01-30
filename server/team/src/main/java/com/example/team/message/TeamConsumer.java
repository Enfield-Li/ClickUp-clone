package com.example.team.message;

import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
import com.example.team.service.ListCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static com.example.amqp.ExchangeKey.AuthorizationQueue;

@Log4j2
@Component
@RequiredArgsConstructor
public class AuthorizationConsumer {

    private final ListCategoryService authorizationService;

    @RabbitListener(queues = AuthorizationQueue)
    public void consumeUpdateEvent(UpdateUserJoinedTeamsDTO updateUserJoinedTeamsDTO) {
        log.info("Consumed {} from queue", updateUserJoinedTeamsDTO.toString());
//        authorizationService.updateUserJoinedTeam(updateUserJoinedTeamsDTO);
    }
}
