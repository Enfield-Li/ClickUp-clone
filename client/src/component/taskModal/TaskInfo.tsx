import {
  Box,
  Center,
  Divider,
  Editable,
  EditablePreview,
  EditableTextarea,
  Flex,
} from "@chakra-ui/react";
import { memo } from "react";
import useTaskDetailContext from "../../context/task_detail/useTaskDetailContext";
import { updateTaskDescription } from "../../networkCalls";
import SelectPriorityIcon from "./priority/SelectPriorityIcon";
import SelectStatusIcons from "./status/SelectStatusIcons";
import TaskOptions from "./taskOptions/DeleteTask";

type Props = {};

export default memo(TaskInfo);
function TaskInfo({}: Props) {
  const { task } = useTaskDetailContext();

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
            <SelectPriorityIcon task={task!} />
          </Box>
        </Flex>

        <TaskOptions taskId={task!.id!} />
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
                updateTaskDescription({
                  taskId: task!.id!,
                  newDesc: e.currentTarget.value,
                });
              }
            }}
          />
        </Editable>
      </Box>
    </Box>
  );
}
