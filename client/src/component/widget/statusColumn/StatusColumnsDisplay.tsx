import { Box } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import {
  CreateFolderState,
  CreateSpaceState,
  StatusCategories,
  StatusCategoryState,
} from "../../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {
  statusCategoriesData: StatusCategories;
  setCreateSpace?: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
  setCreateFolder?: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({
  setCreateSpace,
  setCreateFolder,
  statusCategoriesData,
}: Props) {
  const [statusCategoryState, setStatusCategoryState] =
    useState<StatusCategoryState>({
      errorMsg: "",
      categories: statusCategoriesData,
    });
  const selectedCategory = statusCategoryState.categories.find(
    (category) => category.isSelected
  );
  if (!selectedCategory) throw new Error("selectedCategory not found");

  useEffect(() => {
    if (statusCategoryState.errorMsg) {
      setTimeout(() => {
        setStatusCategoryState((prev) =>
          produce(prev, (draftState) => {
            draftState.errorMsg = "";
          })
        );
      }, 5000);
    }
  }, [statusCategoryState.errorMsg]);

  useEffect(() => {
    if (selectedCategory) {
      setCreateSpace &&
        setCreateSpace((prev) =>
          produce(prev, (draftState) => {
            draftState.selectedStatusColumns = selectedCategory.statusColumns;
          })
        );
      setCreateFolder &&
        setCreateFolder((prev) =>
          produce(prev, (draftState) => {
            draftState.selectedStatusColumns = selectedCategory.statusColumns;
          })
        );
    }
  }, [selectedCategory]);

  return (
    <>
      <Box height="100%" width="50%" pr="4">
        <StatusTemplate
          statusCategoryState={statusCategoryState}
          setStatusCategoryState={setStatusCategoryState}
        />
      </Box>

      <Box height="100%" width="50%">
        <ActiveStatuses
          selectedCategory={selectedCategory}
          setStatusCategoryState={setStatusCategoryState}
        />
      </Box>
    </>
  );
}
