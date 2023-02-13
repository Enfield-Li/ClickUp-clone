package com.example.authorization.message;

import com.example.authorization.AuthorizationService;
import com.example.clients.authorization.UpdateUserJoinedTeamsDTO;
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
public class AuthorizationConsumer {

    private final AuthorizationService authorizationService;

    @RabbitListener(bindings = @QueueBinding(
            exchange = @Exchange(value = internalExchange),
            value = @Queue(value = authorizationQueue),
            key = authorizationRoutingKey))
    public void consumeUpdateEvent(UpdateUserJoinedTeamsDTO updateUserJoinedTeamsDTO) {
        log.info("Consumed {} from queue", updateUserJoinedTeamsDTO.toString());
        authorizationService.updateUserJoinedTeam(updateUserJoinedTeamsDTO);
    }
}
