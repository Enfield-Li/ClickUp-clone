import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { UndeterminedColumn, SetState, SortBy, STATUS } from "../taskTypes";
import EditColumnTitle from "./EditColumnTitle";
import RenameStatus from "./RenameStatus";

type Props = {
  sortBy: SortBy;
  title: string;
  setState: SetState;
  taskAmount?: number;
  borderTopColor: string;
  currentColumn?: UndeterminedColumn;
};

export default function ColumnHeader({
  sortBy,
  title,
  setState,
  taskAmount,
  currentColumn,
  borderTopColor,
}: Props) {
  const [editTitle, setEditTitle] = useState(false);
  const [showColumnOption, setShowColumnOption] = useState(false);
  const bgColor = useColorModeValue("white", "darkMain.200");
  const textColor = useColorModeValue("darkMain.500", "lightMain.300");
  const amountTextColor = useColorModeValue("black", "white");

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
            setState={setState}
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
              {title}
            </Text>

            {/* Task amount */}
            <Text
              px={2}
              border="1px"
              fontSize="2xs"
              rounded="full"
              borderStyle="solid"
              borderColor="gray.400"
              color={amountTextColor}
            >
              {taskAmount}
            </Text>
          </Flex>
        )}

        <Spacer />

        {/* Column options */}
        <Popover>
          {({ isOpen, onClose }) => (
            <>
              {showColumnOption && (
                <PopoverTrigger>
                  <Box cursor="pointer">
                    <i className="bi bi-gear"></i>
                  </Box>
                </PopoverTrigger>
              )}

              <PopoverContent width="200px">
                <PopoverBody shadow="2xl">
                  {sortBy === STATUS && (
                    <RenameStatus
                      onClose={onClose}
                      setEditTitle={setEditTitle}
                    />
                  )}
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>
      </Flex>
    </Box>
  );
}
