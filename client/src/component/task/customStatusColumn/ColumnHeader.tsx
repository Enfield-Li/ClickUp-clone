import { Box, Flex, Spacer, Text, useColorModeValue } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import { SetTaskState, SortBy, UndeterminedColumn } from "../../../types";
import ColumnOptions from "./ColumnOptions";
import EditColumnTitle from "./EditColumnTitle";

type Props = {
  title: string;
  taskAmount?: number;
  borderTopColor: string;
  currentColumn?: UndeterminedColumn;
};

export default memo(ColumnHeader);
function ColumnHeader({
  title,
  taskAmount,
  currentColumn,
  borderTopColor,
}: Props) {
  const bgColor = useColorModeValue("white", "darkMain.200");
  const textColor = useColorModeValue("darkMain.500", "lightMain.300");
  const amountTextColor = useColorModeValue("black", "white");
  const amountBorderColor = useColorModeValue("lightMain.100", "darkMain.300");

  const [editTitle, setEditTitle] = useState(false);
  const [showColumnOption, setShowColumnOption] = useState(false);

  const { taskStateContext } = useTaskDetailContext();
  const { sortBy } = taskStateContext!;

  // Close edit when switching sortBy
  useEffect(() => {
    setEditTitle(false);
  }, [sortBy]);

  return (
    <Box minWidth="250px" mb={4}>
      <Flex
        p={3}
        rounded="3px"
        height="48px"
        borderTop="2px"
        boxShadow="base"
        color={textColor}
        bgColor={bgColor}
        borderTopColor={borderTopColor}
        onMouseOverCapture={() => setShowColumnOption(true)}
        onMouseOutCapture={() => setShowColumnOption(false)}
      >
        {/* Title */}
        {editTitle ? (
          <EditColumnTitle
            setEditTitle={setEditTitle}
            currentColumn={currentColumn}
          />
        ) : (
          <Flex justifyContent="center" alignItems="center">
            <Text
              mr={1}
              fontSize="13px"
              fontWeight={600}
              letterSpacing={1.1}
              textTransform="uppercase"
            >
              {title.replaceAll("_", " ")}
            </Text>

            {/* Task amount */}
            <Text
              px={2}
              border="1px"
              fontSize="2xs"
              rounded="full"
              borderStyle="solid"
              color={amountTextColor}
              borderColor={amountBorderColor}
            >
              {taskAmount}
            </Text>
          </Flex>
        )}

        <Spacer />

        {/* Column options */}
        <ColumnOptions
          sortBy={sortBy}
          setEditTitle={setEditTitle}
          showColumnOption={showColumnOption}
        />
      </Flex>
    </Box>
  );
}
