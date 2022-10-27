import { Box, Text } from "@chakra-ui/react";
import produce from "immer";
import React from "react";
import { reorderStatusColumns } from "../dataProcessing/columnProcessing";
import { SetState, StatusColumns } from "../taskTypes";

type Props = {
  setState: SetState;
};

export default function AddStatusColumn({ setState }: Props) {
  return (
    <Box minWidth="280px" mb={4}>
      <Text
        p={3}
        height="48px"
        opacity="70%"
        borderTop="2px"
        cursor="pointer"
        // boxShadow="base"
        borderTopRadius="sm"
        textTransform="uppercase"
        _hover={{ boxShadow: "base" }}
        onClick={() => {
          setState((pre) => {
            if (pre) {
              produce(pre, (draftState) => {
                return draftState;
              });
            }
            return pre;
          });
        }}
      >
        + Add status
      </Text>
    </Box>
  );
}
