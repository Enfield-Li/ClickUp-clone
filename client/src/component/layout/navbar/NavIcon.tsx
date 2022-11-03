import {
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  url: string;
  name: string;
  children: React.ReactNode;
};

export default function NavIcon({ url, name, children }: Props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const popoverBG = useColorModeValue("rgb(57, 65, 72)", "rgb(79, 87, 98)");

  return (
    <Popover
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnBlur={false}
      returnFocusOnClose={false}
    >
      <PopoverTrigger>
        <Center mt={3}>
          <Center
            rounded="sm"
            width="35px"
            height="35px"
            fontSize="19px"
            cursor="pointer"
            onMouseOverCapture={onOpen}
            onMouseOutCapture={onClose}
            onClick={() => navigate(url)}
            _hover={{ backgroundColor: "rgb(30, 39, 46)" }} // rgb(123, 104, 238)
          >
            {children}
          </Center>
        </Center>
      </PopoverTrigger>

      <PopoverContent
        ml={-1}
        border={0}
        rounded="sm"
        width="70px"
        backgroundColor={popoverBG}
      >
        <PopoverArrow backgroundColor={popoverBG} />

        <PopoverBody
          p={0}
          my="1px"
          mb="3.3px"
          fontSize="15px"
          fontWeight="bold"
        >
          <Center>{name}</Center>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
