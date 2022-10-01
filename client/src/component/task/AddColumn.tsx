import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

type Props = {};

export default function AddColumn({}: Props) {
  return (
    <Box width={"280px"}>
      <Flex m={2}>
        <Text
          color={"green.500"}
          textTransform={"uppercase"}
          fontWeight={800}
          fontSize={"sm"}
          letterSpacing={1.1}
        >
          add column
        </Text>
        <Spacer />
        <i className="bi bi-gear"></i>
      </Flex>
    </Box>
  );
}
