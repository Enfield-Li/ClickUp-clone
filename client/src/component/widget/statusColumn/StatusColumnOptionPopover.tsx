import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Center,
} from "@chakra-ui/react";
import React from "react";

type Props = { children: React.ReactNode };

export default function StatusColumnOptionPopover({ children }: Props) {
  return (
    <Popover placement="bottom-start">
      <PopoverTrigger>
        <Center
          opacity="80%"
          fontSize="19px"
          _hover={{ color: "purple.500", opacity: "100%" }}
        >
          <i className="bi bi-three-dots"></i>
        </Center>
      </PopoverTrigger>
      <PopoverContent shadow="dark-lg" width="190px" py="2">
        {children}
      </PopoverContent>
    </Popover>
  );
}
