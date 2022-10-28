import {
  Box,
  Button,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import useTaskDetailContext, {
  updateCurrentTaskStatus,
} from "../../../../context/task_detail/useTaskDetailContext";
import FinishTask from "./FinishTask";
import StatusOptions from "./StatusOptions";

type Props = {};

export default function StatusDetails({}: Props) {
  const [onHover, setOnHover] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { task, setTask, taskStateContext } = useTaskDetailContext();
  const { setState, sortBy, columnOptions } = taskStateContext!;
  console.log({ columnOptions });

  const column = columnOptions.status.find(
    (column) => column.id === task!.status
  );
  const columnIndex = columnOptions.status.findIndex(
    (column) => column.id === task!.status
  );

  const isLastStatus = columnIndex + 1 === columnOptions.status.length;
  const nextStatus = isLastStatus
    ? columnOptions.status[0]
    : columnOptions.status[columnIndex + 1];

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
              <Center
                px={4}
                onClick={onToggle}
                alignSelf="center"
                width="fit-content"
                borderLeftRadius="sm"
                borderColor={column?.color}
                backgroundColor={column?.color}
                height={onHover && !isOpen ? "37px" : "33px"}
              >
                {/* Choose status */}
                <PopoverTrigger>
                  <Box>{column?.title}</Box>
                </PopoverTrigger>

                {/* Status option */}
                <PopoverContent width="200px">
                  <PopoverBody shadow="2xl">
                    <StatusOptions onOptionClose={onOptionClose} />
                  </PopoverBody>
                </PopoverContent>
              </Center>

              {/* Next stage */}
              <Tooltip
                hasArrow
                placement="top"
                fontWeight={600}
                label={`Next status [${nextStatus.title.toUpperCase()}]`}
              >
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
                    setTask({ ...task!, status: nextStatus.id });
                    updateCurrentTaskStatus(
                      sortBy,
                      task!,
                      setState,
                      nextStatus.id
                    );
                  }}
                >
                  <i className="bi bi-caret-right-fill"></i>
                </Center>
              </Tooltip>
            </Flex>

            {/* Set to finish */}
            {task!.status !== 3 && (
              <Box mx={2}>
                <FinishTask />
              </Box>
            )}
          </>
        )}
      </Popover>
    </Center>
  );
}
