import { Box, Button, Center } from "@chakra-ui/react";
import React from "react";
import EmptySpaceSVG from "../../media/EmptySpaceSVG";

type Props = {};

export default function CreateListPanel({}: Props) {
  return (
    <Center flexDir="column">
      <Box opacity="80%">
        <EmptySpaceSVG />
      </Box>

      <Box mt="3" mb="5" color="lightMain.300">
        This Space is empty. Create a List to get started.
      </Box>

      <Button
        rounded="sm"
        width="135px"
        fontSize="small"
        color="lightMain.100"
        fontWeight="semibold"
        bgColor="customBlue.200"
      >
        + Create List
      </Button>
    </Center>
  );
}
