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
import { SortBy } from "../../../types";
import GroupByItem from "./GroupByItem";

type Props = {
  sortBy: SortBy;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};

export default function GroupByPopperOver({
  sortBy,
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
          title={SortBy.STATUS}
          setSortBy={setSortBy}
          currentSortBy={sortBy}
        >
          <i className="bi bi-view-stacked"></i>
        </GroupByItem>

        <GroupByItem
          onClose={onClose}
          setSortBy={setSortBy}
          currentSortBy={sortBy}
          title={SortBy.PRIORITY}
        >
          <i className="bi bi-flag"></i>
        </GroupByItem>

        <GroupByItem
          onClose={onClose}
          setSortBy={setSortBy}
          currentSortBy={sortBy}
          title={SortBy.DUE_DATE}
        >
          <i className="bi bi-calendar2-date"></i>
        </GroupByItem>
      </PopoverContent>
    </Popover>
  );
}
