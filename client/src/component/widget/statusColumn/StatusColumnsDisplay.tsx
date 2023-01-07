import { Box } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import {
  CreateFolderState,
  CreateSpaceState,
  StatusCategories,
  StatusCategory,
  StatusCategoryState,
} from "../../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {
  teamStatusCategories: StatusCategories;
  handleSelectCategory: (selectedCategory: StatusCategory) => void;
};

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({
  teamStatusCategories,
  handleSelectCategory,
}: Props) {
  const [statusCategoryState, setStatusCategoryState] =
    useState<StatusCategoryState>({
      errorMsg: "",
      categories: teamStatusCategories,
    });
  const selectedCategory = statusCategoryState.categories.find(
    (category) => category.isSelected
  );

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
      handleSelectCategory(selectedCategory);
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
