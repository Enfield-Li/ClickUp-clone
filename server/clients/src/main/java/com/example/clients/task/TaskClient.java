package com.example.clients.task;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "task", url = "${clients.task.url}")
public interface TaskClient {
//
//    @PostMapping(path = TASK_API_VERSION + "/init_tasks")
//    Boolean initTaskInRegistration(
//            @RequestBody InitTasksInRegistrationDTO initTasksInRegistrationDTO);
}
