import { Box } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import {
  StatusCategories,
  StatusCategory,
  StatusCategoryState,
} from "../../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {
  selectedCategoryId?: number;
  teamStatusCategories: StatusCategories;
  handleSelectCategory: (selectedCategory: StatusCategory) => void;
  handleUpdateCategories: (teamStatusCategories: StatusCategories) => void;
};

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({
  selectedCategoryId,
  teamStatusCategories,
  handleSelectCategory,
  handleUpdateCategories,
}: Props) {
  const [statusCategoryState, setStatusCategoryState] =
    useState<StatusCategoryState>({
      errorMsg: "",
      categories: teamStatusCategories,
    });

  useEffect(() => {
    if (selectedCategoryId) {
      setStatusCategoryState(
        produce(statusCategoryState, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id !== selectedCategoryId && category.isSelected) {
              category.isSelected = false;
            }

            if (category.id === selectedCategoryId) {
              category.isSelected = true;
            }
          });
        })
      );
    }
  }, [selectedCategoryId]);

  const selectedCategory = statusCategoryState.categories.find(
    (category) => category.isSelected
  );
  useEffect(() => {
    if (selectedCategory) {
      handleSelectCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (statusCategoryState.categories) {
      handleUpdateCategories(statusCategoryState.categories);
    }
  }, [statusCategoryState.categories]);

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
