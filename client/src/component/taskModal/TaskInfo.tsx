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
import { axiosInstance } from "../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../utils/constant";
import { SetState, UpdateTaskDescDTO } from "../task/taskTypes";
import PriorityDetails from "./priorityDetails/PriorityDetails";
import StatusDetails from "./statusDetails/StatusDetails";
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
            <StatusDetails />
          </Box>

          {/* Divider */}
          <Center mx={4}>
            <Divider orientation="vertical" borderColor="gray.500" />
          </Center>

          {/* Priority */}
          <Box mx={4}>
            <PriorityDetails />
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
                updateTaskDesc(
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

export async function updateTaskDesc(
  taskId: number,
  newDesc: string,
  setState: SetState,
  setTask: SetTask
) {
  setState((previousState) =>
    produce(previousState, (draftState) => {
      if (draftState)
        draftState.orderedTasks.forEach((tasks) =>
          tasks.taskList.forEach((task) => {
            if (task.id === taskId) {
              task.description = newDesc;
              task.updatedAt = new Date();
            }
          })
        );
    })
  );

  setTask((prev) => {
    if (prev) {
      return { ...prev, desc: newDesc };
    }
  });

  try {
    const updateTaskDescDTO: UpdateTaskDescDTO = {
      taskId: taskId,
      newDesc,
    };

    const response = await axiosInstance.put<boolean>(
      API_ENDPOINT.TASK_UPDATE_DESC,
      updateTaskDescDTO
    );

    if (response.data) {
    }
  } catch (error) {
    console.log(error);
  }
}
