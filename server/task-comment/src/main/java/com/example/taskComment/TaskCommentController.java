package com.example.taskComment;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.example.clients.UrlConstants.CUSTOMER_API_VERSION;

@Log4j2
@RestController
@RequiredArgsConstructor
@RequestMapping(CUSTOMER_API_VERSION)
class TaskCommentController {

    private final TaskCommentService taskCommentService;

    @GetMapping
    String test() {
        return "Got it";
    }

    @PostMapping
    void createComment() {
        taskCommentService.createComment();
    }
}
