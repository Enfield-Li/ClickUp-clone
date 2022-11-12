import { Tooltip } from "@chakra-ui/react";
import { memo } from "react";

type Props = { children: React.ReactNode };

function FinishTask({ children }: Props) {
  return (
    <Tooltip
      my={2}
      hasArrow
      placement="top"
      fontWeight="semibold"
      label="Set to complete"
    >
      {children}
    </Tooltip>
  );
}
export default memo(FinishTask);
