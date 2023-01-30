package com.example.amqp;

public class ExchangeKey {

    public static final String internalExchange = "internal.exchange";

    public static final String taskEventQueue = "taskEvent.queue";
    public static final String taskEventRoutingKey = "internal.taskEvent.routing-key";

    public static final String notificationQueue = "notification.queue";
    public static final String notificationRoutingKey = "internal.notification.routing-key";

    public static final String teamQueue = "team.queue";
    public static final String teamRoutingKey = "internal.team.routing-key";

    public static final String authorizationQueue = "authorizationQueue.queue";
    public static final String authorizationRoutingKey = "internal.Authorization.routing-key";

    public static final String statusCategoryQueue = "statusCategory.queue";
    public static final String statusCategoryRoutingKey = "internal.statusCategory.routing-key";

    public static final String teamActivityQueue = "TeamActivityQueue.queue";
    public static final String teamActivityRoutingKey = "internal.TeamActivity.routing-key";
}
