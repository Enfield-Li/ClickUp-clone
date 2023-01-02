import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { KeyboardEvent, memo, useState } from "react";
import { StatusCategory, StatusCategoryState } from "../../../types";

type Props = {
  currentCategory: StatusCategory;
  statusCategoriesSelected: StatusCategoryState;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(StatusCategoryItem);
function StatusCategoryItem({
  currentCategory,
  statusCategoriesSelected: statusCategoryState,
  setStatusCategoryState,
}: Props) {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentCategory.name);

  const fontColor = useColorModeValue("black", "lightMain.200");
  const color = currentCategory.isSelected ? "purple.500" : fontColor;

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleFinishedEdit();
    } else if (e.key === "Escape") {
      setEditing(false);
      setTitle(currentCategory.name);
    }
  }

  function handleFinishedEdit() {
    setStatusCategoryState(
      produce(statusCategoryState, (draftState) => {
        draftState.categories.forEach((category) => {
          const isCurrentCategory = category.name === currentCategory.name;
          const isCategoryNameExist = statusCategoryState.categories.some(
            (category) => category.name.toLowerCase() === title.toLowerCase()
          );

          if (isCurrentCategory) {
            if (isCategoryNameExist) {
              draftState.errorMsg = "WHOOPS! THIS TEMPLATE NAME ALREADY EXISTS";
              return;
            }
            category.name = title;
            setEditing(false);
          }
        });
      })
    );
  }

  function handleSelectCategory() {
    setStatusCategoryState(
      produce(statusCategoryState, (draftState) => {
        draftState.categories.forEach((category) => {
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
