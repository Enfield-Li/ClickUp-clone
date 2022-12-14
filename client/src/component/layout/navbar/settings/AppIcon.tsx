import { Box, Tooltip } from "@chakra-ui/react";
import { memo } from "react";

type Props = {
  iconName: string;
  isTeamOwner: boolean;
  children: React.ReactNode;
};

export default memo(AppIcon);
function AppIcon({ children, iconName, isTeamOwner }: Props) {
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
        cursor="not-allowed"
        _hover={{ color: "purple.500" }}
        mx={isTeamOwner ? "6px" : "3px"}
        fontSize={!isTeamOwner ? "12px" : "16px"}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
