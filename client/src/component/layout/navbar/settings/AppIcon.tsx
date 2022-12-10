import { Box, Tooltip } from "@chakra-ui/react";

type Props = { children: React.ReactNode; iconName: string };

export default function AppIcon({ children, iconName }: Props) {
  return (
    <Tooltip label={iconName} hasArrow arrowSize={6} mb="-1" rounded="md">
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
