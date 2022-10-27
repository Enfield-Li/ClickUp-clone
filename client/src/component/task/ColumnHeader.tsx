import { Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { useState } from "react";
import { ColumnType } from "./taskTypes";

type Props = { color: string; title: string };

export default function ColumnHeader({ color, title }: Props) {
  const [showColumnOption, setShowColumnOption] = useState(false);

  return (
    <Box minWidth="280px" mb={4}>
      <Flex
        p={3}
        height="48px"
        borderTop="2px"
        boxShadow="base"
        borderTopRadius="sm"
        borderColor={color}
        onMouseOverCapture={() => setShowColumnOption(true)}
        onMouseOutCapture={() => setShowColumnOption(false)}
      >
        {/* Title */}
        <Text
          fontSize="sm"
          fontWeight={800}
          letterSpacing={1.1}
          textTransform="uppercase"
        >
          {title}
        </Text>

        <Spacer />

        {/* Option */}
        {showColumnOption && (
          <Box cursor="pointer">
            <i className="bi bi-gear"></i>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
