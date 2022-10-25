package com.example.clients.taskEvent;

import java.io.Serializable;

import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEventDTO implements Serializable {

    @NotNull
    private Field field;

    @NotNull
    private Integer taskId;

    private Integer userId;

    private String username;

    private String afterUpdate;
    private String beforeUpdate;
}
