import { Box, Flex, Select, Spacer } from "@chakra-ui/react";
import React from "react";
import { SortBy } from "../../types";

type Props = {
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};

export default function TaskSortingOptions({ sortBy, setSortBy }: Props) {
  return (
    <Flex p={2} mx={3}>
      <Box>Task navigation</Box>

      <Spacer />
      <Select
        width={"125px"}
        onChange={(e) => {
          setSortBy(e.target.value as SortBy);
        }}
      >
        <option value={SortBy.STATUS}>Status</option>
        <option value={SortBy.PRIORITY}>Priority</option>
        <option value={SortBy.DUE_DATE}>Due Date</option>
      </Select>
    </Flex>
  );
}
