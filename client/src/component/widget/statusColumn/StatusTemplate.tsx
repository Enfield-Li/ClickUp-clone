import { Box, Center, Flex, Input } from "@chakra-ui/react";
import React, { Fragment, memo, useState } from "react";
import StatusCategoryItem from "./StatusCategoryItem";
import produce from "immer";
import { StatusCategoryState, StatusCategory } from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";
import { createStatusCategory } from "../../../networkCalls";

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
  const [createCategory, setCreateCategory] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");

  function resetAll() {
    setCreateCategory(false);
    setCreateCategoryName("");
  }

  function handleFinishedEdit() {
    const selectedCategory = statusCategoryState.categories.find(
      (category) => category.isSelected
    );
    if (!selectedCategory) {
      throw new Error("Cannot find existing category");
    }

    const newCategory = deepCopy(selectedCategory) as StatusCategory;
    newCategory.name = createCategoryName;

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

    createStatusCategory(newCategory, (data) => {
      setStatusCategoryState(
        produce(statusCategoryState, (draftState) => {
          draftState.categories.push(data);
        })
      );
    });
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    if (e.key === "Enter" && createCategoryName) {
      handleFinishedEdit();
    } else if (e.key === "Escape") {
      resetAll();
    }
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

      {createCategory ? (
        <Input
          autoFocus
          size="15px"
          fontSize="16px"
          variant="flushed"
          value={createCategoryName}
          placeholder="Template name"
          onKeyDown={handleKeyPress}
          onBlur={() => !createCategoryName && resetAll()}
          onChange={(e) => setCreateCategoryName(e.target.value)}
        />
      ) : (
        <Box
          fontSize="12px"
          cursor="pointer"
          color="purple.500"
          _hover={{ color: "purple.300" }}
          onClick={() => setCreateCategory(true)}
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
