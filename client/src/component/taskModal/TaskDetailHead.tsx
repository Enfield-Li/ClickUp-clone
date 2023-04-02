import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import { useAuth } from "../../context/auth/useAuth";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { updateTaskTitle } from "../../networkCalls";
import { UpdateTaskTitleDTO } from "../../types";

type Props = {};

export default memo(TaskDetailHead);
function TaskDetailHead({}: Props) {
  const { user } = useAuth();
  const [showEditIcon, setShowEditIcon] = useState(true);

  const { task, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  const { setTaskState, groupBy, columnOptions } = taskStateContext!;

  async function updateTitle(newTitle: string) {
    setTaskState((previousState) => {
      if (previousState)
        return produce(previousState, (draftState) => {
          draftState.orderedTasks.forEach((tasks) =>
            tasks.taskList.forEach(
              (task) => task.id === task.id && (task.title = newTitle)
            )
          );
        });
    });

    const updateTaskTitleDTO: UpdateTaskTitleDTO = {
      taskId: task!.id!,
      newTitle,
    };
    const updateSuccess = await updateTaskTitle(updateTaskTitleDTO);
  }

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
              updateTitle(e.currentTarget.value);
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
