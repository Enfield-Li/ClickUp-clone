import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { memo, useState } from "react";
import useAuthContext from "../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SortBy } from "../../../types";
import {
  newUpdateEvent,
  updateTaskAttribute,
} from "../../task/actions/updateTaskAttributes";
import FinishTask from "./FinishTask";
import StatusOptions from "./StatusOptions";

type Props = {};

export default memo(SelectStatusIcons);
function SelectStatusIcons({}: Props) {
  const popoverContentBgColor = useColorModeValue("white", "darkMain.100");

  const { authState } = useAuthContext();
  const [onHover, setOnHover] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { task, taskStateContext } = useTaskDetailContext();
  const { setTaskState, sortBy, columnOptions } = taskStateContext!;

  const column = columnOptions.statusColumns.find(
    (column) => column.id === task!.status.columnId
  );
  const columnIndex = columnOptions.statusColumns.findIndex(
    (column) => column.id === task!.status.columnId
  );

  const isLastStatus = columnIndex + 1 === columnOptions.statusColumns.length;
  const nextStatus = isLastStatus
    ? columnOptions.statusColumns[0]
    : columnOptions.statusColumns[columnIndex + 1];

  function handleNextStage() {
    const targetStatusColumnId = nextStatus.id;

    updateTaskAttribute(
      authState.user!.id!,
      sortBy,
      SortBy.STATUS,
      task!,
      setTaskState,
      targetStatusColumnId
    );
  }

  function handleSetToFinish() {
    const finishedColumnId = 3;

    updateTaskAttribute(
      authState.user!.id!,
      sortBy,
      SortBy.STATUS,
      task!,
      setTaskState,
      finishedColumnId
    );
  }

  return (
    <Center>
      <Popover
        isLazy
        isOpen={isOpen}
        onClose={onClose}
        placement="bottom"
        closeOnBlur={true}
        // https://chakra-ui.com/docs/components/popover/usage#controlled-usage
      >
        {({ onClose: onOptionClose }: { onClose: () => void }) => (
          // https://chakra-ui.com/docs/components/popover/usage#accessing-internal-taskState
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
            >
              <Center
                px={4}
                height="33px"
                onClick={onToggle}
                alignSelf="center"
                width="fit-content"
                borderLeftRadius="sm"
                borderColor={column?.color}
                backgroundColor={column?.color}
                // height={onHover && !isOpen ? "37px" : "33px"}
              >
                {/* Choose status */}
                <PopoverTrigger>
                  <Box color="white" fontWeight="bold">
                    {column?.title.replaceAll("_", " ")}
                  </Box>
                </PopoverTrigger>

                {/* Status option */}
                <PopoverContent
                  shadow="lg"
                  width="200px"
                  bgColor={popoverContentBgColor}
                >
                  <PopoverBody shadow="2xl">
                    <StatusOptions onOptionClose={onOptionClose} />
                  </PopoverBody>
                </PopoverContent>
              </Center>

              {/* Next stage */}
              <Tooltip
                my={2}
                hasArrow
                placement="top"
                label={
                  <Flex>
                    <Box fontWeight="semibold">
                      Next:<span>&nbsp;</span>
                    </Box>
                    <Box fontWeight="bold">
                      {nextStatus.title.toUpperCase()}
                    </Box>
                  </Flex>
                }
              >
                <Center
                  ml="1px"
                  width="24px"
                  height="33px"
                  fontSize="9px"
                  alignSelf="center"
                  color="darkMain.200"
                  borderRightRadius="sm"
                  borderColor={column?.color}
                  backgroundColor={column?.color}
                  onClick={() => handleNextStage()}
                  //   height={onHover && !isOpen ? "37px" : "33px"}
                >
                  <i className="bi bi-caret-right-fill"></i>
                </Center>
              </Tooltip>
            </Flex>

            {/* Set to finish */}
            {task!.status.columnId !== 3 && (
              <Box mx={2}>
                <FinishTask>
                  <Center
                    opacity="65%"
                    fontSize={"33px"}
                    cursor={"pointer"}
                    _hover={{ color: "yellow.400", opacity: "100%" }}
                    onClick={() => handleSetToFinish()}
                  >
                    <Center border="1.1px solid" rounded="sm" p={2}>
                      <CheckIcon fontSize="md" alignSelf="center" />
                    </Center>
                  </Center>
                </FinishTask>
              </Box>
            )}
          </>
        )}
      </Popover>
    </Center>
  );
}
