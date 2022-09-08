package com.example.amqp.exchange;

import org.springframework.beans.factory.annotation.Value;

public class Notification {

  public static final String internalExchange = "internal.exchange";

  public static final String notificationQueue = "notification.queue";

  public static final String notificationRoutingKey =
    "internal.notification.routing-key";
}
