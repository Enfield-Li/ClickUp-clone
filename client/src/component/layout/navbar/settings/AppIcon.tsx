import { Box, Tooltip } from "@chakra-ui/react";

type Props = { children: React.ReactNode; iconName: string };

export default function AppIcon({ children, iconName }: Props) {
  return (
    <Tooltip
      mb="-1"
      hasArrow
      rounded="md"
      arrowSize={6}
      label={iconName}
      fontWeight="semibold"
    >
      <Box
        mx="6px"
        fontSize="16px"
        cursor="not-allowed"
        _hover={{ color: "purple.500" }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
