import {
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import FinishTask from "./FinishTask";
import StatusOptions from "./StatusOptions";

type Props = {};

export default function StatusDetails({}: Props) {
  const [onHover, setOnHover] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { task, taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;

  const column = columnOptions.status.find(
    (column) => column.id === task!.status
  );
  const statusButtonColor = column?.color.split(".")[0];

  return (
    <Center>
      <Popover
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={true}
        // https://chakra-ui.com/docs/components/popover/usage#controlled-usage
      >
        {({ onClose: onOptionClose }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-state
          <>
            <Flex
              width="96px"
              height="35px"
              cursor="pointer"
              alignContent="center"
              justifyContent="center"
              onMouseOverCapture={() => setOnHover(true)}
              onMouseOutCapture={() => setOnHover(false)}
              style={{ padding: onHover && !isOpen ? "" : "2px" }}
            >
              {/* Choose status */}
              <PopoverTrigger>
                <Center
                  width="70px"
                  onClick={onToggle}
                  alignSelf="center"
                  borderLeftRadius="sm"
                  backgroundColor={column?.color}
                  height={onHover && !isOpen ? "35px" : "33px"}
                >
                  {column?.title}
                </Center>
              </PopoverTrigger>

              {/* Next stage */}
              <Box
                width="24px"
                alignSelf="center"
                borderRightRadius="sm"
                backgroundColor={column?.color}
                style={{ marginLeft: "1px" }}
                height={onHover && !isOpen ? "35px" : "33px"}
              ></Box>
            </Flex>

            {/* Status option */}
            <PopoverContent width="200px">
              <PopoverBody shadow={"2xl"}>
                <StatusOptions onOptionClose={onOptionClose} />
              </PopoverBody>
            </PopoverContent>

            {/* Set to finish */}
            <Box mx={2}>{task!.status !== 3 && <FinishTask />}</Box>
          </>
        )}
      </Popover>
    </Center>
  );
}
