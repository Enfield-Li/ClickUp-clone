import {
  Box,
  Center,
  Divider,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import { SetTask } from "../../context/task_detail/TaskDetailContextTypes";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { updateTaskDescription } from "../task/actions/TaskActions";
import {
  SetState,
  TaskEvents,
  UpdateEvent,
  UpdateTaskDescDTO,
} from "../task/taskTypes";
import SelectPriorityIcon from "./priorityDetails/SelectPriorityIcon";
import SelectStatusIcons from "./statusDetails/SelectStatusIcons";
import TaskOptions from "./taskOptions/DeleteTask";

type Props = {};

export default function TaskInfo({}: Props) {
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
    <Box flexBasis={"50%"}>
      <Flex
        py={4}
        borderBottom="1px"
        borderBottomColor="gray.500"
        justifyContent="space-between"
      >
        <Flex>
          {/* Status */}
          <Box mr={4}>
            <SelectStatusIcons />
          </Box>

          {/* Divider */}
          <Center mx={4}>
            <Divider orientation="vertical" borderColor="gray.500" />
          </Center>

          {/* Priority */}
          <Box mx={4}>
            <SelectPriorityIcon />
          </Box>
        </Flex>

        <TaskOptions />
      </Flex>

      {/* Desc */}
      <Box>
        <Flex>
          Desc:
          <Center opacity={"40%"}>
            {/* Edit button */}
            <i className="bi bi-pencil-square"></i>
          </Center>
        </Flex>

        <Editable
          width="100%"
          defaultValue={task!.description}
          placeholder="Add some desc"
        >
          <EditablePreview />
          <EditableTextarea
            onBlur={(e) => {
              if (e.target.value !== task!.title) {
                updateDescription(
                  task!.id!,
                  e.currentTarget.value,
                  setState,
                  setTask
                );
              }
            }}
          />
        </Editable>
      </Box>
    </Box>
  );
}

export async function updateDescription(
  taskId: number,
  newDesc: string,
  setState: SetState,
  setTask: SetTask
) {
  const updateTaskDescDTO: UpdateTaskDescDTO = { taskId, newDesc };

  const updateSuccess = await updateTaskDescription(updateTaskDescDTO);

  if (updateSuccess) {
    setState((previousState) => {
      if (previousState)
        return produce(previousState, (draftState) => {
          draftState.orderedTasks.forEach((tasks) =>
            tasks.taskList.forEach(
              (task) => task.id === taskId && (task.description = newDesc)
            )
          );
        });
    });

    setTask((prev) => prev && { ...prev, description: newDesc });
  }
}
