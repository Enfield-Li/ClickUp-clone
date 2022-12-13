import { Box, Center, Flex, Input } from "@chakra-ui/react";
import React, { memo, useState } from "react";
import { StatusCategoriesSelected } from "./StatusColumnsDisplay";
import CategoryList from "./CategoryList";
import produce from "immer";

type Props = {
  statusCategoriesSelected: StatusCategoriesSelected;
  setStatusCategories: React.Dispatch<
    React.SetStateAction<StatusCategoriesSelected>
  >;
};

export default memo(StatusTemplate);
function StatusTemplate({
  statusCategoriesSelected: statusCategories,
  setStatusCategories,
}: Props) {
  const [createCategory, setCreateCategory] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");

  function resetAll() {
    setCreateCategory(false);
    setCreateCategoryName("");
  }

  function handleFinishedEdit() {
    setStatusCategories(
      produce(statusCategories, (draftState) => {
        const duplicateCategory = draftState.statusCategories.find(
          (category) => category.name === draftState.selectedCategoryName
        );
        if (!duplicateCategory)
          throw new Error("Cannot find existing category WTF?");
        duplicateCategory.name = createCategoryName;

        draftState.statusCategories.push(duplicateCategory);
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
      <Box ml="3" maxHeight="200px" overflow="auto">
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
            ({statusCategories.statusCategories.length})
          </Center>
        </Flex>

        {statusCategories?.statusCategories.map((currentCategory, index) => (
          <Box key={index}>
            <CategoryList
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
