import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import { SetTask } from "../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { SetState, UpdateTaskTitleDTO } from "../task/taskTypes";

type Props = {};

export default function TaskDetailHead({}: Props) {
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
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value !== task!.title) {
              updateTaskTitle(
                task!.id!,
                e.currentTarget.value,
                setState,
                setTask
              );
            }
          }}
          onBlur={(e) => {
            setShowEditIcon(true);
            if (e.target.value !== task!.title) {
              updateTaskTitle(
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

export async function updateTaskTitle(
  taskId: number,
  newTitle: string,
  setState: SetState,
  setTask: SetTask
) {
  try {
    const updateTaskTitleDTO: UpdateTaskTitleDTO = {
      taskId: taskId,
      newTitle,
    };

    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_TITLE,
      updateTaskTitleDTO
    );

    if (response.data) {
      setState((previousState) => {
        if (previousState)
          return produce(previousState, (draftState) => {
            if (draftState)
              draftState.orderedTasks.forEach((tasks) =>
                tasks.taskList.forEach((task) => {
                  if (task.id === taskId) {
                    task.title = newTitle;
                    task.updatedAt = new Date();
                  }
                })
              );
          });
      });

      setTask((prev) => {
        if (prev) {
          return { ...prev, title: newTitle };
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}
