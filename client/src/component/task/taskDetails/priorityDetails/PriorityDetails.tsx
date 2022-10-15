import {
  Popover,
  Tooltip,
  PopoverTrigger,
  Center,
  PopoverContent,
  PopoverBody,
  Box,
} from "@chakra-ui/react";
import { SetTask } from "../../../../context/task_detail/TaskDetailContextTypes";
import { ColumnOptions, SetState, Task } from "../../Data";
import PriorityOptions from "./PriorityOptions";

type Props = {
  task: Task;
  setTask: SetTask;
  setState: SetState;
  columnOptions: ColumnOptions;
};

export default function PriorityDetails({
  task,
  setTask,
  setState,
  columnOptions,
}: Props) {
  const currentTaskPriority = columnOptions.priority.find(
    (priority) => priority.id === task.priority
  );
  const priorityFlagColor = currentTaskPriority?.color;

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
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
                task={task}
                setTask={setTask}
                onClose={onClose}
                setState={setState}
                priorityColumns={columnOptions.priority}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
