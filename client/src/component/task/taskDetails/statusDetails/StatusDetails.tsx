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
              height="33px"
              cursor="pointer"
              // https://stackoverflow.com/a/16765030/16648127
              width="fit-content"
              alignContent="center"
              justifyContent="center"
              onMouseOverCapture={() => setOnHover(true)}
              onMouseOutCapture={() => setOnHover(false)}
              //   px={onHover && !isOpen ? "" : "2px"}
            >
              {/* Choose status */}
              <PopoverTrigger>
                <Center
                  px={4}
                  width="fit-content"
                  onClick={onToggle}
                  alignSelf="center"
                  borderLeftRadius="sm"
                  borderColor={column?.color}
                  backgroundColor={column?.color}
                  height={onHover && !isOpen ? "37px" : "33px"}
                  //   borderLeftWidth={onHover && !isOpen ? "4px" : ""}
                >
                  {column?.title}
                </Center>
              </PopoverTrigger>

              {/* Next stage */}
              <Center
                ml="1px"
                width="24px"
                fontSize="9px"
                alignSelf="center"
                borderRightRadius="sm"
                borderColor={column?.color}
                backgroundColor={column?.color}
                height={onHover && !isOpen ? "37px" : "33px"}
                // borderRightWidth={onHover && !isOpen ? "4px" : ""}
                onClick={() => {
                  console.log(columnOptions.status);
                }}
              >
                <i className="bi bi-caret-right-fill"></i>
              </Center>
            </Flex>

            {/* Status option */}
            <PopoverContent width="200px">
              <PopoverBody shadow="2xl">
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
