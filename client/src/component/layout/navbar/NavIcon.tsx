import { Center, Tooltip } from "@chakra-ui/react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { Section } from "../../../ApplicationEntry";

type Props = {
  url?: string;
  name?: string;
  isSelected?: boolean;
  children: React.ReactNode;
};

export default memo(NavIcon);
function NavIcon({ url, name, isSelected, children }: Props) {
  const navigate = useNavigate();

  return (
    <Tooltip
      ml={0}
      px={4}
      pb={1}
      hasArrow
      label={name}
      arrowSize={7}
      rounded="3px"
      role="tooltip"
      fontSize="12px"
      placement="right"
      fontWeight="bold"
    >
      <Center my="3px">
        <Center
          p="2"
          width="35px"
          height="35px"
          rounded="3px"
          role="menuitem"
          fontSize="16.5px"
          aria-label={name}
          onClick={() => url && navigate(url)}
          cursor={url ? "pointer" : "not-allowed"}
          bgColor={isSelected ? "customBlue.200" : undefined}
          _hover={{ bgColor: isSelected ? undefined : "darkMain.300" }}
        >
          {children}
        </Center>
      </Center>
    </Tooltip>
  );
}
