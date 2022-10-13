package com.example.amqp.exchange;

public class TaskEvent {

  public static final String internalExchange = "internal.exchange";

  public static final String taskEventQueue = "taskEvent.queue";

  public static final String taskEventRoutingKey =
    "internal.taskEvent.routing-key";
}
