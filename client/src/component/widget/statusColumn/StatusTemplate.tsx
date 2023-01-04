import { Box, Center, Flex, Input } from "@chakra-ui/react";
import React, { Fragment, memo, useState } from "react";
import StatusCategoryItem from "./StatusCategoryItem";
import produce from "immer";
import {
  StatusCategoryState,
  StatusCategory,
  CreateStatusCategoryDTO,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { createStatusCategory } from "../../../networkCalls";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";

type Props = {
  statusCategoryState: StatusCategoryState;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(StatusTemplate);
function StatusTemplate({
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
      setStatusCategoryState(
        produce(statusCategoryState, (draftState) => {
          draftState.categories.unshift(newCategory);
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
    <Box height="80%">
      <Box ml="3" maxHeight="235px" overflow="auto">
        <Flex alignItems="center">
          <Box
            opacity="50%"
            fontSize="12px"
            letterSpacing="wide"
            fontWeight="semibold"
          >
            TEMPLATE
          </Box>

          <Center
            ml="2px"
            color="gray"
            width="12px"
            height="12px"
            fontSize="10px"
            fontWeight="semibold"
          >
            ({statusCategoryState.categories.length})
          </Center>
        </Flex>

        {statusCategoryState.categories.map((currentCategory, index) => (
          <Box key={currentCategory.id}>
            <StatusCategoryItem
              currentCategory={currentCategory}
              statusCategoriesSelected={statusCategoryState}
              setStatusCategoryState={setStatusCategoryState}
            />
          </Box>
        ))}
      </Box>

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

      {statusCategoryState.errorMsg && (
        <Flex mt="2" fontSize="12px" color="red.500">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <Box ml="2">{statusCategoryState.errorMsg}</Box>
        </Flex>
      )}
    </Box>
  );
}
