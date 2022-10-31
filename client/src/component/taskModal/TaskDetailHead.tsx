import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import useAuthContext from "../../context/auth/useAuthContext";
import { SetTask } from "../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { updateTaskTitle } from "../task/actions/TaskActions";
import { SetState, UpdateEvent, UpdateTaskTitleDTO } from "../task/taskTypes";

type Props = {};

export default function TaskDetailHead({}: Props) {
  const { authState } = useAuthContext();
  const [showEditIcon, setShowEditIcon] = useState(true);

  const {
    task,
    setTask,
    isModalOpen,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <Flex>
      {/* Title */}
      <Editable mr={6} defaultValue={task!.title}>
        <EditablePreview />
        <EditableInput
          onFocus={() => setShowEditIcon(false)}
          onBlur={(e) => {
            setShowEditIcon(true);

            if (e.target.value !== task!.title) {
              updateTitle(
                authState.user!.id,
                task!.id!,
                e.currentTarget.value,
                setState,
                setTask
              );
            }
          }}
        />
      </Editable>

      {/* Edit */}
      {showEditIcon && (
        <Center opacity={"40%"}>
          <i className="bi bi-pencil-square"></i>
        </Center>
      )}
    </Flex>
  );
}

export async function updateTitle(
  userId: number,
  taskId: number,
  newTitle: string,
  setState: SetState,
  setTask: SetTask
) {
  const updateTaskTitleDTO: UpdateTaskTitleDTO = { taskId, newTitle };

  const updateSuccess = await updateTaskTitle(updateTaskTitleDTO);

  if (updateSuccess) {
    setState((previousState) => {
      if (previousState)
        return produce(previousState, (draftState) => {
          draftState.orderedTasks.forEach((tasks) =>
            tasks.taskList.forEach(
              (task) => task.id === taskId && (task.title = newTitle)
            )
          );
        });
    });

    setTask((prev) => {
      if (prev) {
        const newEvent: UpdateEvent = {
          userId,
          field: "title",
          taskId,
          beforeUpdate: prev.title,
          afterUpdate: newTitle,
          createdAt: new Date(),
        };

        return {
          ...prev,
          title: newTitle,
          taskEvents: [...prev.taskEvents, newEvent],
        };
      }
    });
  }
}
