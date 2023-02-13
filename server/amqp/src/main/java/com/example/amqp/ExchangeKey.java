package com.example.amqp;

public class ExchangeKey {

    public static final String internalExchange = "internal.exchange";

    // task
    public static final String updateTaskStatusOnAddingNewColumnQueue =
            "updateTaskStatusOnAddingNewColumn.queue";
    public static final String updateTaskStatusOnAddingNewColumnRoutingKey =
            "internal.updateTaskStatusOnAddingNewColumnRoutingKey.routing-key";
    public static final String deleteTasksQueue =
            "deleteTasks.queue";
    public static final String deleteTasksRoutingKey =
            "internal.deleteTasksRoutingKey.routing-key";

    // task event
    public static final String taskEventQueue = "taskEvent.queue";
    public static final String taskEventRoutingKey =
            "internal.taskEvent.routing-key";

    // notification
    public static final String notificationQueue =
            "notification.queue";
    public static final String notificationRoutingKey =
            "internal.notification.routing-key";

    // team
    public static final String teamQueue = "team.queue";
    public static final String teamRoutingKey = "internal.team.routing-key";

    // auth
    public static final String authorizationQueue =
            "authorizationQueue.queue";
    public static final String authorizationRoutingKey =
            "internal.Authorization.routing-key";

    // status category
    public static final String statusCategoryQueue = "statusCategory.queue";
    public static final String statusCategoryRoutingKey =
            "internal.statusCategory.routing-key";
}
