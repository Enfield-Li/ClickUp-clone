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
import { useTaskDetail } from "../../context/task_detail/useTaskDetail";
import { updateTaskTitle } from "../../networkCalls";
import { UpdateTaskTitleDTO } from "../../types";

type Props = {};

export default memo(TaskDetailHead);
function TaskDetailHead({}: Props) {
  const { user } = useAuth();
  const { task, updateTitle } = useTaskDetail();
  const [showEditIcon, setShowEditIcon] = useState(true);

  async function handleUpdateTitle(newTitle: string) {
    updateTitle(newTitle);

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
              handleUpdateTitle(e.currentTarget.value);
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
