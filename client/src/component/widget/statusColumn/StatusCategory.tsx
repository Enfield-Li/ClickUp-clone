import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { KeyboardEvent, memo, useState } from "react";
import { StatusCategories, StatusCategory } from "../../../types";

type Props = {
  currentCategory: StatusCategory;
  statusCategoriesSelected: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default memo(StatusCategoryItem);
function StatusCategoryItem({
  currentCategory,
  statusCategoriesSelected: statusCategories,
  setStatusCategories,
}: Props) {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const fontColor = useColorModeValue("black", "lightMain.200");
  const [title, setTitle] = useState(currentCategory.name);

  const color = currentCategory.isSelected ? "purple.500" : fontColor;

  function handleFinishedEdit() {
    setEditing(false);
    updateStatusCategories();
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleFinishedEdit();
    } else if (e.key === "Escape") {
      setEditing(false);
      setTitle(currentCategory.name);
    }
  }

  function updateStatusCategories() {
    setStatusCategories(
      produce(statusCategories, (draftState) => {
        draftState.forEach((category) => {
          const isCurrentCategory = category.name === currentCategory.name;
          if (isCurrentCategory) {
            category.name = title;
          }
        });
      })
    );
  }

  function handleSelectCategory() {
    setStatusCategories(
      produce(statusCategories, (draftState) => {
        draftState.forEach((category) => {
          if (category.isSelected) {
            category.isSelected = undefined;
          } else if (category.id === currentCategory.id) {
            category.isSelected = true;
          }
        });
      })
    );
  }

  return (
    <Flex
      my="2"
      cursor="pointer"
      justifyContent="space-between"
      onClick={handleSelectCategory}
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
    >
      {editing ? (
        <Input
          autoFocus
          height="30px"
          width="223px"
          value={title}
          variant="flushed"
          onKeyDown={handleKeyPress}
          onBlur={handleFinishedEdit}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <Box color={color} fontWeight="semibold">
          {currentCategory.name}
        </Box>
      )}

      {hover && currentCategory.name !== "Custom" && (
        <Flex opacity="60%">
          {/* Edit */}
          <Center
            mr="3"
            fontSize="10px"
            onClick={() => setEditing(true)}
            _hover={{ color: "purple.500" }}
          >
            <i className="bi bi-pencil-fill"></i>
          </Center>

          {/* Close */}
          {!editing && (
            <Center fontSize="10px" _hover={{ color: "purple.500" }}>
              <CloseIcon />
            </Center>
          )}
        </Flex>
      )}
    </Flex>
  );
}
