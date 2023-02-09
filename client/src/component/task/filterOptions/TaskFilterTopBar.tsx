import {
  Box,
  Center,
  Divider,
  Flex,
  Input,
  Select,
  Spacer,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo, useState } from "react";
import useUnImplementedToast from "../../../hook/useFeatureNotImplemented";
import { SortBy } from "../../../types";
import GroupByPopperOver from "./GroupByPopperOver";

type Props = {
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};

export default memo(TaskFilterTopBar);
function TaskFilterTopBar({ sortBy, setSortBy }: Props) {
  const toast = useUnImplementedToast();
  const [hover, setHover] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const borderColor = useColorModeValue("blackAlpha.600", "lightMain.200");

  return (
    <Flex
      p="2"
      mx="3"
      height="46px"
      fontSize="small"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* Search */}
      <Flex cursor="not-allowed" opacity="40%">
        <Box>
          <i className="bi bi-funnel-fill"></i>
        </Box>

        <Center fontSize="8px" mr="1" pl="1">
          {true ? (
            <Box>
              <i className="bi bi-caret-down-fill"></i>
            </Box>
          ) : (
            <Box>
              <i className="bi bi-caret-right-fill"></i>
            </Box>
          )}
        </Center>

        <Input
          ml="2"
          fontSize="small"
          variant="unstyled"
          onChange={() => toast()}
          placeholder="Search tasks..."
        />

        <Box opacity="80%">
          <i className="bi bi-three-dots"></i>
        </Box>
      </Flex>

      <Flex alignItems="center" justifyContent="center">
        {/* Sort by */}
        <Flex mr="6" cursor="not-allowed" opacity="40%">
          <Box mr="1">Sort by</Box>
          <Box>
            <i className="bi bi-caret-down-fill"></i>
          </Box>
        </Flex>

        {/* Group by */}
        <GroupByPopperOver
          isOpen={isOpen}
          sortBy={sortBy}
          onClose={onClose}
          setSortBy={setSortBy}
        >
          <Flex
            mr="6"
            opacity="80%"
            cursor="pointer"
            onClick={() => onOpen()}
            onMouseLeave={() => setHover(false)}
            onMouseOverCapture={() => setHover(true)}
          >
            <Box mr="7px">Group up:</Box>
            <Flex color={hover ? "purple.400" : ""}>
              <Box opacity="70%" mr="1">
                {sortBy}
              </Box>

              {isOpen ? (
                <Box>
                  <i className="bi bi-caret-up-fill"></i>
                </Box>
              ) : (
                <Box>
                  <i className="bi bi-caret-down-fill"></i>
                </Box>
              )}
            </Flex>
          </Flex>
        </GroupByPopperOver>

        {/* Subtasks */}
        <Flex mr="6" cursor="not-allowed" opacity="40%">
          <Box mr="1">Subtasks: </Box>
          <Box opacity="70%" mr="1">
            hide
          </Box>
          <Box>
            <i className="bi bi-caret-down-fill"></i>
          </Box>
        </Flex>

        {/* Filter person */}
        <Center
          mr="2"
          rounded="sm"
          opacity="40%"
          height="20px"
          fontSize="10px"
          borderWidth="1px"
          alignItems="center"
          cursor="not-allowed"
          justifyContent="center"
          borderColor={borderColor}
        >
          <Center borderRightWidth="0.5px" pr="1" borderColor={borderColor}>
            <Box mx="1">
              <i className="bi bi-person-fill"></i>
            </Box>
            Me
          </Center>

          <Center p="2px" mr="1">
            <Box mx="1">
              <i className="bi bi-people"></i>
            </Box>
            Assignees
          </Center>
        </Center>

        {/* Share */}
        <Center
          px="1"
          mr="3"
          rounded="sm"
          opacity="40%"
          height="20px"
          fontSize="10px"
          borderWidth="1px"
          alignItems="center"
          cursor="not-allowed"
          justifyContent="center"
          borderColor={borderColor}
        >
          <Box mr="1">
            <i className="bi bi-share-fill"></i>
          </Box>
          share
        </Center>

        {/* options */}
        <Center opacity="40%" fontSize="md" cursor="not-allowed">
          <i className="bi bi-three-dots"></i>
        </Center>
      </Flex>
      {/* <Select
        border="none"
        width="125px"
        onChange={(e) => setSortBy(e.target.value as SortBy)}
      >
        <option value={SortBy.STATUS}>Status</option>
        <option value={SortBy.PRIORITY}>Priority</option>
        <option value={SortBy.DUE_DATE}>Due Date</option>
      </Select> */}
    </Flex>
  );
}
