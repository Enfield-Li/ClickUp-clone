package com.example.amqp;

public class ExchangeKey {

    public static final String internalExchange = "internal.exchange";

    public static final String taskEventQueue = "taskEvent.queue";
    public static final String taskEventRoutingKey = "internal.taskEvent.routing-key";

    public static final String notificationQueue = "notification.queue";
    public static final String notificationRoutingKey = "internal.notification.routing-key";

    public static final String teamActivityQueue = "teamActivity.queue";
    public static final String teamActivityRoutingKey = "internal.teamActivity.routing-key";

    public static final String AuthorizationQueue = "authorizationQueue.queue";
    public static final String AuthorizationRoutingKey = "internal.Authorization.routing-key";

    public static final String statusCategoryQueue = "statusCategory.queue";
    public static final String statusCategoryRoutingKey = "internal.statusCategory.routing-key";
}
