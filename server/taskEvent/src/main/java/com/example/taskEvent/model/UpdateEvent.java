package com.example.taskEvent.model;

import com.example.clients.taskEvent.updateEventDTO.UpdateEventDTO;
import javax.persistence.Entity;
import javax.validation.constraints.NotNull;
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
    private String after;

    private String before;

    public static UpdateEvent toUpdateEvent(UpdateEventDTO updateEventDTO) {
        return UpdateEvent
            .builder()
            .id(updateEventDTO.id())
            .before(updateEventDTO.before())
            .after(updateEventDTO.after())
            .field(updateEventDTO.field())
            .taskId(updateEventDTO.taskId())
            .userId(updateEventDTO.userId())
            .username(updateEventDTO.username())
            .build();
    }
}
