import { Box, Center, Flex, Input } from "@chakra-ui/react";
import React, { memo, useState } from "react";
import StatusCategoryItem from "./StatusCategory";
import produce from "immer";
import { StatusCategories } from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";

type Props = {
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default memo(StatusTemplate);
function StatusTemplate({ statusCategories, setStatusCategories }: Props) {
  const [createCategory, setCreateCategory] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");

  function resetAll() {
    setCreateCategory(false);
    setCreateCategoryName("");
  }

  function handleFinishedEdit() {
    const selectedCategory = statusCategories.find(
      (category) => category.isSelected
    );
    if (!selectedCategory) {
      throw new Error("Cannot find existing category");
    }

    const newCategory = deepCopy(selectedCategory);
    newCategory.name = createCategoryName;
    // network calls

    setStatusCategories(
      produce(statusCategories, (draftState) => {
        draftState.push(newCategory);
      })
    );
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
            ({statusCategories.length})
          </Center>
        </Flex>

        {statusCategories?.map((currentCategory, index) => (
          <Box key={currentCategory.id}>
            <StatusCategoryItem
              currentCategory={currentCategory}
              statusCategoriesSelected={statusCategories}
              setStatusCategories={setStatusCategories}
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
    </Box>
  );
}
