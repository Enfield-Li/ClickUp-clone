import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GroupBy } from "../../../types";
import GroupByItem from "./GroupByItem";

type Props = {
  groupBy: GroupBy;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  setSortBy: React.Dispatch<React.SetStateAction<GroupBy>>;
};

export default function GroupByPopperOver({
  groupBy,
  isOpen,
  onClose,
  children,
  setSortBy,
}: Props) {
  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="bottom-end">
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent width="200px" p="2" shadow="2xl">
        <Box ml="2" fontWeight="semibold" mb="1">
          GROUP BY
        </Box>

        <GroupByItem
          onClose={onClose}
          title={GroupBy.STATUS}
          setSortBy={setSortBy}
          currentSortBy={groupBy}
        >
          <i className="bi bi-view-stacked"></i>
        </GroupByItem>

        <GroupByItem
          onClose={onClose}
          setSortBy={setSortBy}
          currentSortBy={groupBy}
          title={GroupBy.PRIORITY}
        >
          <i className="bi bi-flag"></i>
        </GroupByItem>

        <GroupByItem
          onClose={onClose}
          setSortBy={setSortBy}
          currentSortBy={groupBy}
          title={GroupBy.DUE_DATE}
        >
          <i className="bi bi-calendar2-date"></i>
        </GroupByItem>
      </PopoverContent>
    </Popover>
  );
}
