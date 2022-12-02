import { Box, Button } from "@chakra-ui/react";
import { StatusColumnCategory } from "../../types";
import ActiveStatus from "./ActiveStatus";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  selectedCategory: StatusColumnCategory | undefined;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default function ActiveStatuses({
  selectedCategory,
  setStatusCategories,
}: Props) {
  const finishedStatus = selectedCategory?.statusColumns.find(
    (statusColumn) => statusColumn.markAsClosed
  );

  return (
    <Box>
      <Box height="205px">
        <Box height="170px" overflow="auto">
          {selectedCategory?.statusColumns.map(
            (statusColumn) =>
              !statusColumn.markAsClosed && (
                <Box key={statusColumn.id}>
                  <ActiveStatus statusColumn={statusColumn} />
                </Box>
              )
          )}
        </Box>

        <Button
          my="1"
          size="sm"
          height="25px"
          rounded="sm"
          bgColor="customBlue.200"
          _hover={{ bgColor: "customBlue.100" }}
        >
          + Add status
        </Button>
      </Box>

      <Box height="89.5px">
        <Box
          opacity="50%"
          fontSize="12px"
          letterSpacing="wide"
          fontWeight="semibold"
        >
          FINISHED STATUS
        </Box>

        {finishedStatus && <ActiveStatus statusColumn={finishedStatus} />}
      </Box>
    </Box>
  );
}
