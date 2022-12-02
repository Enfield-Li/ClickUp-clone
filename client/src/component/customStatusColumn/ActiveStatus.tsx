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
      rounded="3px"
      cursor="pointer"
      borderWidth="1px"
      borderColor="black"
      justifyContent="space-between"
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
    >
      <Flex alignItems="center">
        <Box
          mr="6px"
          width="10px"
          rounded="sm"
          height="10px"
          bgColor={statusColumn.color}
        ></Box>

        <Box>{statusColumn.title}</Box>
      </Flex>

      <Center _hover={{ color: "purple.500" }}>
        <i className="bi bi-three-dots"></i>
      </Center>
    </Flex>
  );
}
