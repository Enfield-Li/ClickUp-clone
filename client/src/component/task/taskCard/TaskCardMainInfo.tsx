import {
  Flex,
  Heading,
  Center,
  Tooltip,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { Task } from "../../../types";

type Props = { task: Task };

function TaskCardMainInfo({ task }: Props) {
  const headerColor = useColorModeValue("gray.700", "white");

  return (
    <Flex mb={2}>
      {/* Task title */}
      <Heading color={headerColor} fontSize="xl" fontFamily="heading">
        {task.title}
      </Heading>

      {/* Preview description */}
      {task.description && (
        <Center ml={2} opacity="70%" onClick={(e) => e.stopPropagation()}>
          <Tooltip
            p={3}
            width="300px"
            height="250px"
            placement="right"
            label={task.description}
          >
            <Center
              width="20px"
              height="20px"
              _hover={{
                bgColor: "darkMain.300",
              }}
            >
              <i className="bi bi-justify-left"></i>
            </Center>
          </Tooltip>
        </Center>
      )}
    </Flex>
  );
}
export default memo(TaskCardMainInfo);
