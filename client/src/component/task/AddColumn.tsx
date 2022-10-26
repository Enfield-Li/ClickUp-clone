import { Box, Flex, Spacer, Text } from "@chakra-ui/react";

type Props = {};

export default function AddColumn({}: Props) {
  return (
    <Box minWidth="280px">
      <Flex
        m={2}
        p={3}
        borderTop="2px"
        boxShadow="base"
        borderTopRadius="sm"
        borderColor="gray.400"
      >
        <Text
          fontSize="sm"
          fontWeight={800}
          color="green.500"
          letterSpacing={1.1}
          textTransform="uppercase"
        >
          add column
        </Text>
        <Spacer />
        <i className="bi bi-gear"></i>
      </Flex>
    </Box>
  );
}
