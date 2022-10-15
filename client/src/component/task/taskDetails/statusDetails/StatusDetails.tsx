import {
  Center,
  Popover,
  PopoverTrigger,
  Button,
  Tooltip,
  PopoverContent,
  PopoverBody,
} from "@chakra-ui/react";
import { SetTask } from "../../../../context/task_detail/TaskDetailContextTypes";
import { ColumnOptions, SetState, Task } from "../../Data";
import StatusOptions, { updateCurrentTaskStatus } from "./StatusOptions";

type Props = {
  task: Task;
  setTask: SetTask;
  setState: SetState;
  columnOptions: ColumnOptions;
};

export default function StatusDetails({
  task,
  setTask,
  setState,
  columnOptions,
}: Props) {
  const column = columnOptions.status.find(
    (column) => column.id === task.status
  );
  const statusButtonColor = column?.color.split(".")[0];

  return (
    <Center>
      <Popover>
        {({ onClose }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <PopoverTrigger>
              <Button colorScheme={statusButtonColor}>{column?.title}</Button>
            </PopoverTrigger>

            {/* Set to finish */}
            {task.status !== 3 && (
              <Tooltip label="Set to complete" placement="top" hasArrow>
                <Center
                  cursor={"pointer"}
                  fontSize={"30px"}
                  _hover={{ color: "yellow.400" }}
                  onClick={() => {
                    setTask({ ...task, status: 3 });
                    // updateCurrentTaskStatus(task, setState, 3);
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
                  task={task}
                  setTask={setTask}
                  onClose={onClose}
                  setState={setState}
                  statusColumns={columnOptions.status}
                />
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </Center>
  );
}
