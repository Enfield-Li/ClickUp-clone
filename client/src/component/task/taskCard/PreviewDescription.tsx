import {
  Center,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { Task } from "../taskTypes";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  task: Task;
};

export default function PreviewDescription({
  task,
  isOpen,
  onOpen,
  onClose,
}: Props) {
  return (
    <Popover
      returnFocusOnClose={false}
      isOpen={isOpen}
      onClose={onClose}
      placement="auto"
      closeOnBlur={false}
    >
      <PopoverTrigger>
        <Center
          width="22px"
          height="22px"
          rounded="md"
          opacity="70%"
          fontSize="sm"
          onMouseOutCapture={onClose}
          onMouseOverCapture={onOpen}
          _hover={{ backgroundColor: "blackAlpha.500" }}
        >
          <i className="bi bi-justify-left"></i>
        </Center>
      </PopoverTrigger>

      <PopoverContent overflow="auto">
        <PopoverArrow />
        <PopoverBody>{task.description}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
