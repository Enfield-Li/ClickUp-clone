import { Box, Button } from "@chakra-ui/react";
import { memo } from "react";
import { StatusColumnCategory } from "../../types";
import ActiveStatus from "./ActiveStatus";
import AddStatus from "./AddStatus";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  selectedCategory: StatusColumnCategory | undefined;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default memo(ActiveStatuses);
function ActiveStatuses({ selectedCategory, setStatusCategories }: Props) {
  const selectedCategoryName = selectedCategory?.name;
  const finishedStatus = selectedCategory?.statusColumns.find(
    (statusColumn) => statusColumn.markAsClosed
  );

  return (
    <Box>
      <Box height="205px">
        <Box maxHeight="170px" overflow="auto">
          {selectedCategory?.statusColumns.map(
            (currentStatusColumn) =>
              !currentStatusColumn.markAsClosed && (
                <Box key={currentStatusColumn.id}>
                  <ActiveStatus
                    currentStatusColumn={currentStatusColumn}
                    setStatusCategories={setStatusCategories}
                    selectedCategoryName={selectedCategoryName}
                  />
                </Box>
              )
          )}
        </Box>

        <AddStatus
          setStatusCategories={setStatusCategories}
          selectedCategoryName={selectedCategoryName}
          statusAmount={selectedCategory?.statusColumns.length}
        />
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

        {finishedStatus && (
          <ActiveStatus
            currentStatusColumn={finishedStatus}
            setStatusCategories={setStatusCategories}
            selectedCategoryName={selectedCategoryName}
          />
        )}
      </Box>
    </Box>
  );
}
