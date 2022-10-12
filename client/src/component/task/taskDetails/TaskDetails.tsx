import {
  Box,
  Button,
  Center,
  Divider,
  Editable,
  EditableInput,
  EditablePreview,
  EditableTextarea,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@chakra-ui/react";
import produce from "immer";
import { useRef } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../../../utils/AxiosInterceptor";
import { API_ENDPOINT } from "../../../utils/constant";
import { SetState, UpdateTaskDescDTO, UpdateTaskTitleDTO } from "../Data";
import SelectOption, { updateCurrentTask } from "./SelectOption";

type Props = {};

export default function TaskDetailModal({}: Props) {
  const initialRef = useRef(null);
  const {
    isOpen,
    onClose,
    setTask,
    taskUpdateInfo,
    setTaskUpdateInfo,
    task: currentTask,
  } = useTaskDetailContext();

  if (!currentTask || !taskUpdateInfo)
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalBody>loading</ModalBody>
          </ModalContent>
        </Modal>
      </>
    );

  const { state, setState, currentColumnId } = taskUpdateInfo;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      initialFocusRef={initialRef}
    >
      <ModalOverlay />

      <ModalContent>
        {/* Header */}
        <ModalHeader mb={"-4"}>
          <Flex>
            <Editable mr={6} defaultValue={currentTask.title}>
              <EditablePreview />
              <EditableInput
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  e.currentTarget.value !== currentTask.title &&
                  updateTaskTitle(
                    currentTask!.id!,
                    e.currentTarget.value,
                    setState
                  )
                }
                onBlur={(e) => {
                  if (e.target.value !== currentTask.title) {
                    updateTaskTitle(
                      currentTask!.id!,
                      e.currentTarget.value,
                      setState
                    );
                  }
                }}
              />
            </Editable>

            <Center opacity={"40%"}>
              <i className="bi bi-pencil-square"></i>
            </Center>
          </Flex>
        </ModalHeader>

        {/* Body */}
        <ModalBody minHeight="450px">
          <Flex>
            {/* Left side */}
            <Box flexBasis={"50%"}>
              <Flex justifyContent={"space-evenly"} my={3}>
                <Center>
                  <Popover>
                    <PopoverTrigger>
                      <Button>Status</Button>
                    </PopoverTrigger>

                    {/* Complete CheckBox */}
                    <Tooltip label="Set to complete" placement="top" hasArrow>
                      <Center
                        cursor={"pointer"}
                        fontSize={"30px"}
                        onClick={() =>
                          updateCurrentTask(
                            currentTask,
                            setState,
                            3,
                            currentColumnId
                          )
                        }
                      >
                        <i className="bi bi-check-square"></i>
                      </Center>
                    </Tooltip>

                    {/* Status flag */}
                    <PopoverContent width="200px">
                      <PopoverBody shadow={"2xl"}>
                        <SelectOption
                          setState={setState}
                          currentTask={currentTask}
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
                    border="1px solid"
                    borderRadius={"50%"}
                    width="40px"
                    height="40px"
                    onClick={() => console.log("choose priority")}
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
                  defaultValue={currentTask.description}
                  placeholder="Add some desc"
                >
                  <EditablePreview />
                  <EditableTextarea
                    onBlur={(e) => {
                      if (e.target.value !== currentTask.title) {
                        updateTaskDesc(
                          currentTask!.id!,
                          e.currentTarget.value,
                          setState
                        );
                      }
                    }}
                  />
                </Editable>
              </Box>
            </Box>

            <Center>
              <Divider orientation="vertical" />
            </Center>

            {/* Right side */}
            <Box flexBasis={"50%"}>
              <Flex justifyContent={"space-evenly"} my={3}>
                <Box>Stats 1</Box>
                <Box>Task dueDate: {currentTask.dueDate}</Box>
              </Flex>
              <Box>Events</Box>
            </Box>
          </Flex>
        </ModalBody>

        {/* Close button */}
        <ModalCloseButton ref={initialRef} />

        {/* Footer */}
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

async function updateTaskDesc(
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

async function updateTaskTitle(
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
