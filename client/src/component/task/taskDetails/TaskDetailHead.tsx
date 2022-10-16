import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { updateTaskTitle } from "./TaskInfo";

type Props = {};

export default function TaskDetailHead({}: Props) {
  const [showEditIcon, setShowEditIcon] = useState(true);

  const {
    task,
    isModalOpen,
    setTask,
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
              updateTaskTitle(task!.id!, e.currentTarget.value, setState);
            }
          }}
          onBlur={(e) => {
            setShowEditIcon(true);
            if (e.target.value !== task!.title) {
              updateTaskTitle(task!.id!, e.currentTarget.value, setState);
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
