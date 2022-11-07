import {
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { SetTask } from "../../../context/task_detail/TaskDetailContextTypes";
import { PriorityColumn, Task } from "../../task/taskTypes";
import PriorityOptions from "./PriorityOptions";
import { capitalizeFirstLetter } from "../../../utils/capitalizeFirstLetter";

type Props = {
  task: Task;
  setTask?: SetTask;
  children: React.ReactNode;
  currentTaskPriority: PriorityColumn | undefined;
};

export default function SelectPriorityPopover({
  task,
  setTask,
  children: flagIcon,
  currentTaskPriority,
}: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");
  const noPriorityOrTaskFinished = task?.priority === 1 || task?.priority === 0;

  return (
    // https://github.com/chakra-ui/chakra-ui/issues/2843#issuecomment-748641805
    <Popover>
      {({ onClose: onOptionClose }) => (
        <>
          <Tooltip
            my={2}
            hasArrow
            placement="top"
            label={
              noPriorityOrTaskFinished
                ? "Set priority"
                : capitalizeFirstLetter(currentTaskPriority!.title) +
                  " priority"
            }
            fontWeight="semibold"
          >
            <Box display="inline-block">
              <PopoverTrigger>{flagIcon}</PopoverTrigger>
            </Box>
          </Tooltip>

          <PopoverContent width="200px" bgColor={popoverContentBgColor}>
            <PopoverBody shadow={"2xl"} m={0} p={0}>
              <PriorityOptions
                task={task!}
                setTask={setTask}
                onOptionClose={onOptionClose}
              />
            </PopoverBody>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
}
