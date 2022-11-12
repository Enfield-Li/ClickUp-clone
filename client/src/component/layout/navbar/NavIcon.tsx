import {
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import FixedNavBar from "./FixedNavBar";

type Props = {
  url: string;
  name: string;
  isSelected: boolean;
  children: React.ReactNode;
};

function NavIcon({ url, name, isSelected, children }: Props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tooltip
      ml={0}
      px={4}
      py={1}
      hasArrow
      label={name}
      arrowSize={7}
      placement="right"
    >
      <Center mt={2}>
        <Center
          rounded="sm"
          width="38px"
          height="38px"
          fontSize="19px"
          cursor="pointer"
          onMouseOverCapture={onOpen}
          onMouseOutCapture={onClose}
          onClick={() => navigate(url)}
          bgColor={isSelected ? "customBlue.200" : undefined}
          _hover={{
            backgroundColor: isSelected ? undefined : "darkMain.300",
          }}
        >
          {children}
        </Center>
      </Center>
    </Tooltip>
  );
}

export default memo(NavIcon);
