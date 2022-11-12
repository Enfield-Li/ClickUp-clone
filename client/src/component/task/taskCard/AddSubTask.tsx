import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { memo } from "react";
import { Task } from "../../../types";

type Props = { task: Task; cardBgColor: "white" | "darkMain.200" };

function AddSubTask({ task, cardBgColor }: Props) {
  const addSubTaskBgColor = useColorModeValue("lightMain.100", "darkMain.500");

  return (
    <Box
      py="4px"
      opacity="55%"
      bgColor={cardBgColor}
      _hover={{ borderTop: "1px solid gray", bgColor: cardBgColor }}
    >
      <Box
        ml="2"
        px="5px"
        pb="2px"
        rounded="sm"
        fontSize="small"
        cursor="pointer"
        width="fit-content"
        _hover={{ bgColor: addSubTaskBgColor }}
      >
        + Add subtask
      </Box>
    </Box>
  );
}

export default memo(AddSubTask);
