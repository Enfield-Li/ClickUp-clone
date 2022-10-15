import {
  Center,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
} from "@chakra-ui/react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { updateTaskTitle } from "./CurrentTask";

type Props = {};

export default function TaskDetailHead({}: Props) {
  const {
    task,
    isOpen,
    setTask,
    onModalOpen,
    onModalClose,
    taskStateContext,
    setTaskStateContext,
  } = useTaskDetailContext();

  const { setState, sortBy, columnOptions } = taskStateContext!;

  return (
    <Flex>
      <Editable mr={6} defaultValue={task!.title}>
        <EditablePreview />
        <EditableInput
          onKeyDown={(e) =>
            e.key === "Enter" &&
            e.currentTarget.value !== task!.title &&
            updateTaskTitle(task!.id!, e.currentTarget.value, setState)
          }
          onBlur={(e) => {
            if (e.target.value !== task!.title) {
              updateTaskTitle(task!.id!, e.currentTarget.value, setState);
            }
          }}
        />
      </Editable>

      <Center opacity={"40%"}>
        <i className="bi bi-pencil-square"></i>
      </Center>
    </Flex>
  );
}
