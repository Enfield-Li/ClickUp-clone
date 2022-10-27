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
} from "@chakra-ui/react";
import { useState } from "react";
import { ColumnType, SetState, SortBy, STATUS } from "../taskTypes";
import EditColumnTitle from "./EditColumnTitle";
import RenameStatus from "./RenameStatus";

type Props = {
  sortBy: SortBy;
  color: string;
  title: string;
  setState: SetState;
  taskAmount?: number;
  currentColumn?: ColumnType;
};

export default function ColumnHeader({
  sortBy,
  color,
  title,
  setState,
  taskAmount,
  currentColumn,
}: Props) {
  const [editTitle, setEditTitle] = useState(false);
  const [showColumnOption, setShowColumnOption] = useState(false);

  return (
    <Box minWidth="280px" mb={4}>
      <Flex
        p={3}
        height="48px"
        borderTop="2px"
        boxShadow="base"
        borderTopRadius="sm"
        borderColor={color}
        onMouseOverCapture={() => setShowColumnOption(true)}
        onMouseOutCapture={() => setShowColumnOption(false)}
      >
        {/* Title */}
        {editTitle ? (
          // Edit title
          <EditColumnTitle
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
              opacity="90%"
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
