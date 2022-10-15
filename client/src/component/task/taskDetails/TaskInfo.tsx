import {
  Box,
  Button,
  Center,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import produce from "immer";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../../utils/constant";
import {
  ColumnOptions,
  SetState,
  State,
  Task,
  UpdateTaskDescDTO,
  UpdateTaskTitleDTO,
} from "../Data";
import PriorityOptions from "./PriorityOptions";
import StatusOptions, { updateCurrentTaskStatus } from "./StatusOptions";

type Props = {
  task: Task;
  setTask: SetTask;
  setState: SetState;
  currentColumnId: number;
  columnOptions: ColumnOptions;
};

export default function TaskInfo({
  task,
  setTask,
  setState,
  currentColumnId,
  columnOptions,
}: Props) {
  const column = columnOptions.status.find(
    (column) => column.id === task.status
  );
  const statusButtonColor = column?.color.split(".")[0];

  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task.priority
  );
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    <Box flexBasis={"50%"}>
      <Flex justifyContent={"space-evenly"} my={3}>
        {/* Status */}
        <Center>
          <Popover>
            {({ onClose }) => (
              // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
              <>
                <PopoverTrigger>
                  <Button colorScheme={statusButtonColor}>
                    {column?.title}
                  </Button>
                </PopoverTrigger>

                {/* Task finish checkbox */}
                {task.status !== 3 && (
                  <Tooltip label="Set to complete" placement="top" hasArrow>
                    <Center
                      cursor={"pointer"}
                      fontSize={"30px"}
                      _hover={{ color: "yellow.400" }}
                      onClick={() => {
                        setTask({ ...task, status: 3 });
                        updateCurrentTaskStatus(
                          task,
                          setState,
                          3,
                          currentColumnId
                        );
                      }}
                    >
                      <i className="bi bi-check-square"></i>
                    </Center>
                  </Tooltip>
                )}

                {/* Status option */}
                <PopoverContent width="200px">
                  <PopoverBody shadow={"2xl"}>
                    <StatusOptions
                      setTask={setTask}
                      onClose={onClose}
                      currentTask={task}
                      setState={setState}
                      currentColumnId={currentColumnId}
                      statusColumns={columnOptions.status}
                    />
                  </PopoverBody>
                </PopoverContent>
              </>
            )}
          </Popover>
        </Center>

        {/* Priority */}
        {/* https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805 */}
        <Popover>
          {({ onClose }) => (
            <>
              <Tooltip hasArrow placement="top" label="Set priority">
                <Box display="inline-block">
                  <PopoverTrigger>
                    <Center
                      width="40px"
                      height="40px"
                      cursor={"pointer"}
                      border="1px dashed"
                      borderRadius={"50%"}
                      color={priorityFlagColor}
                      _hover={{ color: "purple.400" }}
                    >
                      <i className="bi bi-flag"></i>
                    </Center>
                  </PopoverTrigger>
                </Box>
              </Tooltip>

              <PopoverContent width="200px">
                <PopoverBody shadow={"2xl"} m={0} p={0}>
                  <PriorityOptions
                    onClose={onClose}
                    setTask={setTask}
                    currentTask={task}
                    setState={setState}
                    currentColumnId={currentColumnId}
                    priorityColumns={columnOptions.priority}
                  />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
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
