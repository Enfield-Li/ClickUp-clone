import { Center, Tooltip } from "@chakra-ui/react";
import React, { memo } from "react";

type Props = { taskName: string };

export default memo(SaveButton);
function SaveButton({ taskName }: Props) {
  return (
    <Tooltip
      mb={2}
      hasArrow
      placement="top"
      fontWeight="semibold"
      label={!taskName ? "Please enter a task name" : "Press enter to save"}
    >
      <Center
        p={2}
        mr={2}
        pb="10px"
        rounded="sm"
        width="45px"
        height="15px"
        fontSize="12px"
        cursor="pointer"
        fontWeight="semibold"
        bgColor="customBlue.50"
      >
        SAVE
      </Center>
    </Tooltip>
  );
}
