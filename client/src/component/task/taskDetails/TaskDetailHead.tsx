import {
  Flex,
  Editable,
  EditablePreview,
  EditableInput,
  Center,
} from "@chakra-ui/react";
import React from "react";
import { SetState, Task } from "../Data";
import { updateTaskTitle } from "./TaskInfo";

type Props = {
  task: Task;
  setState: SetState;
};

export default function TaskDetailHead({ setState, task }: Props) {
  return (
    <Flex>
      <Editable mr={6} defaultValue={task.title}>
        <EditablePreview />
        <EditableInput
          onKeyDown={(e) =>
            e.key === "Enter" &&
            e.currentTarget.value !== task.title &&
            updateTaskTitle(task!.id!, e.currentTarget.value, setState)
          }
          onBlur={(e) => {
            if (e.target.value !== task.title) {
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
