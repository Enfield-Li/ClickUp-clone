package com.example.amqp.exchange;

public class NotificationExchange {

  public static final String internalExchange = "internal.exchange";

  public static final String notificationQueue = "notification.queue";

  public static final String notificationRoutingKey =
    "internal.notification.routing-key";
}
