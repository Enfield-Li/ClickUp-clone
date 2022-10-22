import { Box, Flex, Select, Spacer } from "@chakra-ui/react";
import React from "react";
import { DUE_DATE, PRIORITY, SortBy, STATUS } from "./taskTypes";

type Props = {
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};

export default function TaskNavigation({ sortBy, setSortBy }: Props) {
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
        <option value={STATUS}>Status</option>
        <option value={PRIORITY}>Priority</option>
        <option value={DUE_DATE}>Due Date</option>
      </Select>
    </Flex>
  );
}
