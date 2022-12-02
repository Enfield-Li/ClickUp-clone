import { Box, Center, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { StatusColumn } from "../../types";

type Props = { statusColumn: StatusColumn };

export default function ActiveStatus({ statusColumn }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <Flex
      px="2"
      my="8px"
      rounded="md"
      cursor="pointer"
      borderWidth="1px"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
    >
      <Flex alignItems="center">
        {/* Square */}
        <Box
          mr="6px"
          width="10px"
          rounded="sm"
          height="10px"
          bgColor={statusColumn.color}
        ></Box>

        {/* Title */}
        <Box>{statusColumn.title.replaceAll("_", " ")}</Box>

        {/* Edit */}
        {hover && (
          <Box ml="3" opacity="60%" fontSize="10px">
            <i className="bi bi-pencil-fill"></i>
          </Box>
        )}
      </Flex>

      {/* Options */}
      <Center _hover={{ color: "purple.500" }}>
        <i className="bi bi-three-dots"></i>
      </Center>
    </Flex>
  );
}
