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

  // Close edit when switching sortBy
  useEffect(() => {
    setEditTitle(false);
  }, [sortBy]);

  return (
    <Box minWidth="280px" mb={4}>
      <Flex
        p={3}
        height="48px"
        borderTop="2px"
        boxShadow="base"
        bgColor={bgColor}
        borderTopRadius="sm"
        borderTopColor={borderTopColor}
        onMouseOverCapture={() => setShowColumnOption(true)}
        onMouseOutCapture={() => setShowColumnOption(false)}
      >
        {/* Title */}
        {editTitle ? (
          // Edit title
          <EditColumnTitle
            // sortBy={sortBy}
            setState={setState}
            setEditTitle={setEditTitle}
            currentColumn={currentColumn}
          />
        ) : (
          // Show title
          <Flex justifyContent="center" alignItems="center">
            {/* Title */}
            <Text
              mr={1}
              fontSize="sm"
              fontWeight={800}
              letterSpacing={1.1}
              textTransform="uppercase"
            >
              {title}
            </Text>

            {/* Task amount */}
            <Center
              px={2}
              border="1px"
              opacity="80%"
              fontSize="2xs"
              rounded="full"
              borderStyle="solid"
              borderColor="gray.400"
            >
              {taskAmount}
            </Center>
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
