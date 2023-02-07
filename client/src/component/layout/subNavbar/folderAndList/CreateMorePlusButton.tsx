import { Tooltip, Center } from "@chakra-ui/react";
import React from "react";

type Props = { isSpace?: boolean };

export default function CreateMorePlusButton({ isSpace }: Props) {
  return (
    <Tooltip
      mb="1"
      hasArrow
      rounded="3px"
      arrowSize={7}
      openDelay={100}
      placement="top"
      fontSize="12px"
      fontWeight="semibold"
      label={"Create Lists, Docs and more"}
    >
      <Center
        pb="1"
        width="15px"
        height="15px"
        rounded="full"
        fontSize="15px"
        color="darkMain.200"
        fontWeight="extrabold"
        bgColor="lightMain.400"
        mr={isSpace ? "3" : "2"}
        _hover={{ bgColor: "purple.500" }}
      >
        +
      </Center>
    </Tooltip>
  );
}
