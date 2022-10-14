import {
  Flex,
  Center,
  Popover,
  PopoverTrigger,
  Button,
  Tooltip,
  PopoverContent,
  PopoverBody,
  Editable,
  EditablePreview,
  EditableTextarea,
  Box,
} from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../../utils/constant";
import {
  SetState,
  State,
  Task,
  UpdateTaskDescDTO,
  UpdateTaskTitleDTO,
} from "../Data";
import SelectOption, { updateCurrentTask } from "./SelectOption";

type Props = {
  task: Task;
  state: State;
  setTask: SetTask;
  setState: SetState;
  currentColumnId: number;
};

export default function TaskInfo({
  task,
  state,
  setTask,
  setState,
  currentColumnId,
}: Props) {
  const column = state.columnOptions.status.find(
    (column) => column.id === task.status
  );
  const buttonColor = column?.color.split(".")[0];

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        <Center>
          <Popover>
            <PopoverTrigger>
              <Button colorScheme={buttonColor}>{column?.title}</Button>
            </PopoverTrigger>

            {/* Complete CheckBox */}
            {task.status !== 3 && (
              <Tooltip label="Set to complete" placement="top" hasArrow>
                <Center
                  cursor={"pointer"}
                  fontSize={"30px"}
                  _hover={{ color: "yellow.400" }}
                  onClick={() => {
                    setTask({ ...task, status: 3 });
                    updateCurrentTask(task, setState, 3, currentColumnId);
                  }}
                >
                  <i className="bi bi-check-square"></i>
                </Center>
              </Tooltip>
            )}

            {/* Choose status */}
            <PopoverContent width="200px">
              <PopoverBody shadow={"2xl"}>
                <SelectOption
                  task={task}
                  setTask={setTask}
                  setState={setState}
                  currentTask={task}
                  currentColumnId={currentColumnId}
                  statusColumns={state.columnOptions.status}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Center>

        <Tooltip label="Set priority" placement="top" hasArrow>
          <Center
            cursor={"pointer"}
            border="1px dashed"
            borderRadius={"50%"}
            width="40px"
            height="40px"
            onClick={() => {
              console.log("choose priority");
              setTask({ ...task, priority: 1 });
            }}
            _hover={{ color: "purple.400" }}
          >
            <i className="bi bi-flag"></i>
          </Center>
        </Tooltip>
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
          defaultValue={task.description}
          placeholder="Add some desc"
        >
          <EditablePreview />
          <EditableTextarea
            onBlur={(e) => {
              if (e.target.value !== task.title) {
                updateTaskDesc(task!.id!, e.currentTarget.value, setState);
              }
            }}
          />
        </Editable>
      </Box>
    </Box>
  );
}

export async function updateTaskDesc(
  taskId: number,
  newDesc: string,
  setState: SetState
) {
  try {
    const updateTaskDescDTO: UpdateTaskDescDTO = {
      id: taskId,
      newDesc,
    };

    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_DESC,
      updateTaskDescDTO
    );

    if (response.data) {
      setState((previousState) =>
        produce(previousState, (draftState) => {
          if (draftState)
            draftState.orderedTasks.forEach((tasks) =>
              tasks.taskList.forEach((task) =>
                task.id === taskId ? (task.description = newDesc) : task
              )
            );
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateTaskTitle(
  taskId: number,
  newTitle: string,
  setState: SetState
) {
  try {
    const updateTaskTitleDTO: UpdateTaskTitleDTO = {
      id: taskId,
      newTitle,
    };

    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_TITLE,
      updateTaskTitleDTO
    );

    if (response.data) {
      setState((previousState) =>
        produce(previousState, (draftState) => {
          if (draftState)
            draftState.orderedTasks.forEach((tasks) =>
              tasks.taskList.forEach((task) =>
                task.id === taskId ? (task.title = newTitle) : task
              )
            );
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
}
