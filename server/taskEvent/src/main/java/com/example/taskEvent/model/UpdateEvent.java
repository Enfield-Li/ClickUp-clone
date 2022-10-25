package com.example.taskEvent.model;

import javax.persistence.Entity;
import javax.validation.constraints.NotNull;

import com.example.clients.taskEvent.UpdateEventDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
// https://stackoverflow.com/questions/31664098/lombok-builder-inheritance-workaround
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class UpdateEvent extends BaseEvent {

    @NotNull
    private String afterUpdate;

    private String beforeUpdate;

    public static UpdateEvent toUpdateEvent(UpdateEventDTO updateEventDTO) {
        return UpdateEvent
            .builder()
            .beforeUpdate(updateEventDTO.getBeforeUpdate())
            .afterUpdate(updateEventDTO.getAfterUpdate())
            .field(updateEventDTO.getField())
            .taskId(updateEventDTO.getTaskId())
            .userId(updateEventDTO.getUserId())
            .username(updateEventDTO.getUsername())
            .build();
    }
}
