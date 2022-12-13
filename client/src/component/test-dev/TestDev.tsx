import { Box, Button, Center, Divider, Flex, Input } from "@chakra-ui/react";
import { MouseEvent, useState } from "react";

export default function BasicDatePicker() {
  const [value, setValue] = useState("");

  function handleCreateList(
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box height="340px" rounded="md" width="500px">
      <Center px="37px" height="100px" alignItems="center" borderTopRadius="md">
        <Box fontSize="2xl" fontWeight="semibold">
          Create Folder
        </Box>
      </Center>

      <Divider borderColor="blackAlpha.500" />

      <Box px="37px" py="6" mt="16px">
        <Box fontWeight="semibold" fontSize="sm" mb="1">
          Folder name
        </Box>

        <Input
          autoFocus
          value={value}
          variant="unstyled"
          placeholder="Enter folder name"
          onChange={(e) => setValue(e.target.value)}
        />

        <Box>
          <Flex
            p="5"
            px="4"
            fontSize="sm"
            borderWidth="1px"
            fontWeight="semibold"
            borderBottomWidth="0px"
            borderColor="blackAlpha.500"
            justifyContent="space-between"
          >
            <Box>Lists</Box>
            <Box>List </Box>
          </Flex>
          <Flex
            p="5"
            px="4"
            fontSize="sm"
            borderWidth="1px"
            fontWeight="semibold"
            borderBottomWidth="0px"
            borderColor="blackAlpha.500"
            justifyContent="space-between"
          >
            <Box>Share Folder with</Box>
            <Box>people</Box>
          </Flex>
          <Flex
            p="5"
            px="4"
            fontSize="sm"
            borderWidth="1px"
            fontWeight="semibold"
            borderColor="blackAlpha.500"
            justifyContent="space-between"
          >
            <Box>Task statuses</Box>
            <Box>User Space statuses</Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
