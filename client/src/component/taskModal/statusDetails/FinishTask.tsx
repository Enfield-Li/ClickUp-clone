import { Tooltip } from "@chakra-ui/react";

type Props = { children: React.ReactNode };

export default function FinishTask({ children }: Props) {
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
