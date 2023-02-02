import { Box, useColorModeValue, useToast } from "@chakra-ui/react";
import React, { memo } from "react";
import useUnImplementedToast from "../../../hook/useFeatureNotImplemented";
import { Task } from "../../../types";

type Props = { task: Task; cardBgColor: "white" | "darkMain.200" };

export default memo(AddSubTask);
function AddSubTask({ task, cardBgColor }: Props) {
  const toast = useUnImplementedToast();
  const addSubTaskBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  return (
    <Box
      py="4px"
      opacity="55%"
      bgColor={cardBgColor}
      onClick={() => toast()}
      //   _hover={{ borderTop: "1px solid gray", bgColor: cardBgColor }}
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
