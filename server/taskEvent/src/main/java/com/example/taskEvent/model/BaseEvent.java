package com.example.taskEvent.model;

import com.example.clients.taskEvent.updateEventDTO.Field;
import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

// https://stackoverflow.com/a/47197531/16648127
// https://docs.oracle.com/javaee/5/api/javax/persistence/MappedSuperclass.html
@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
class BaseEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private Field field;

    @NotNull
    private Integer taskId;

    @NotNull
    private Integer userId;

    @NotNull
    private String username;
}
