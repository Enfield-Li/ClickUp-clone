import { Box, Flex, Select, Spacer } from "@chakra-ui/react";
import React, { memo } from "react";
import { SortBy } from "../../../types";

type Props = {
  sortBy: SortBy;
  setSortBy: React.Dispatch<React.SetStateAction<SortBy>>;
};

export default memo(TaskSortingOptions);
function TaskSortingOptions({ sortBy, setSortBy }: Props) {
  return (
    <Flex
      p="2"
      mx="3"
      height="46px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box opacity="60%" fontSize="small">
        <i className="bi bi-funnel-fill"></i>
      </Box>

      <Select
        border="none"
        width="125px"
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
