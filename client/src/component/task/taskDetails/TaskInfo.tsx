import {
  Box,
  Center,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
} from "@chakra-ui/react";
import produce from "immer";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../../utils/constant";
import { SetState, UpdateTaskDescDTO } from "../Data";
import PriorityDetails from "./priorityDetails/PriorityDetails";
import StatusDetails from "./statusDetails/StatusDetails";

type Props = {};

export default function TaskInfo({}: Props) {
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
  console.log(task);

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        {/* Status */}
        <StatusDetails />

        {/* Priority */}
        <PriorityDetails />
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
