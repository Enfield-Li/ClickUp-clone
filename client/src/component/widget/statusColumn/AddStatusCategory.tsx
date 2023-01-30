import { Box, Input } from "@chakra-ui/react";
import produce from "immer";
import React, { useState } from "react";
import { createStatusCategory } from "../../../networkCalls";
import { CreateStatusCategoryDTO, StatusCategoryState } from "../../../types";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";

type Props = {
  statusCategoryState: StatusCategoryState;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default function AddStatusCategory({
  statusCategoryState,
  setStatusCategoryState,
}: Props) {
  const [creating, setCreating] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");

  function resetAll() {
    setCreating(false);
    setCreateCategoryName("");
  }

  function handleCreateCategoryItem() {
    const selectedCategory = statusCategoryState.categories.find(
      (category) => category.isSelected
    );
    if (!selectedCategory) {
      throw new Error("Cannot find existing category");
    }

    const isCategoryNameExist = statusCategoryState.categories.some(
      (category) =>
        category.name.toLowerCase() === createCategoryName.toLowerCase()
    );

    if (isCategoryNameExist) {
      setStatusCategoryState(
        produce(statusCategoryState, (draftState) => {
          draftState.errorMsg = "WHOOPS! THIS TEMPLATE NAME ALREADY EXISTS";
        })
      );
      return;
    }

    const dto: CreateStatusCategoryDTO = {
      name: createCategoryName,
      teamId: selectedCategory.teamId,
      statusColumns: selectedCategory.statusColumns,
    };

    createStatusCategory(dto, (newCategory) => {
      resetAll();
      setStatusCategoryState(
        produce(statusCategoryState, (draftState) => {
          newCategory["isSelected"] = true;
          newCategory.statusColumns.sort((a, b) => a.orderIndex - b.orderIndex);

          draftState.categories.push(newCategory);
          draftState.categories.forEach((category) => {
            if (category.id !== newCategory.id && category.isSelected) {
              category.isSelected = false;
            }
          });
        })
      );
    });
  }

  function handleOnBlur() {
    if (createCategoryName) {
      handleCreateCategoryItem();
    } else {
      resetAll();
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    handleInputKeyPress({
      e,
      handleOnEsc: resetAll,
      value: createCategoryName,
      handleOnEnter: handleCreateCategoryItem,
    });
  }

  return (
    <>
      {creating ? (
        <Input
          autoFocus
          size="15px"
          fontSize="16px"
          variant="flushed"
          onBlur={handleOnBlur}
          value={createCategoryName}
          placeholder="Template name"
          onKeyDown={handleKeyPress}
          onChange={(e) => setCreateCategoryName(e.target.value)}
        />
      ) : (
        <Box
          fontSize="12px"
          cursor="pointer"
          color="purple.500"
          _hover={{ color: "purple.300" }}
          onClick={() => setCreating(true)}
        >
          + New template
        </Box>
      )}
    </>
  );
}
