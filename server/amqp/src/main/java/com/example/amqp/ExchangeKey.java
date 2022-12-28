package com.example.amqp;

public class ExchangeKey {

    public static final String internalExchange = "internal.exchange";

    public static final String notificationQueue = "notification.queue";
    public static final String notificationRoutingKey = "internal.notification.routing-key";

    public static final String taskEventQueue = "taskEvent.queue";
    public static final String taskEventRoutingKey = "internal.taskEvent.routing-key";

    public static final String panelActivityQueue = "panelActivity.queue";
    public static final String panelActivityRoutingKey = "internal.panelActivity.routing-key";

    public static final String AuthorizationQueue = "authorizationQueue.queue";
    public static final String AuthorizationRoutingKey = "internal.Authorization.routing-key";
}
