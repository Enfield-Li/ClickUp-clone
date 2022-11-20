import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import useAuthContext from "../../context/auth/useAuthContext";
import { SetTask } from "../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { updateTaskTitle } from "../task/actions/networkActions";
import {
  ActionField,
  SetTaskState,
  UpdateEvent,
  UpdateTaskTitleDTO,
} from "../../types";

type Props = {};

function TaskDetailHead({}: Props) {
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

  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

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
                setTaskState,
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

async function updateTitle(
  userId: number,
  taskId: number,
  newTitle: string,
  setTaskState: SetTaskState,
  setTask: SetTask
) {
  const updateTaskTitleDTO: UpdateTaskTitleDTO = { taskId, newTitle };

  const updateSuccess = await updateTaskTitle(updateTaskTitleDTO);

  if (updateSuccess) {
    setTaskState((previousState) => {
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
          field: ActionField.TITLE,
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
export default memo(TaskDetailHead);
