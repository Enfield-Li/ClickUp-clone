import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { KeyboardEvent, memo, useState } from "react";
import { StatusColumnCategory } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  currentCategory: StatusColumnCategory;
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default memo(CategoryList);
function CategoryList({
  currentCategory,
  statusCategories,
  setStatusCategories,
}: Props) {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const fontColor = useColorModeValue("black", "lightMain.200");
  const [title, setTitle] = useState(currentCategory.statusCategoryName);

  const color =
    statusCategories?.selectedCategoryName ===
    currentCategory.statusCategoryName
      ? "purple.500"
      : fontColor;

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
      setTitle(currentCategory.statusCategoryName);
    }
  }

  function updateStatusCategories() {
    setStatusCategories(
      produce(statusCategories, (draftState) => {
        draftState.statusColumnCategories.forEach((category) => {
          const isCurrentCategory =
            category.statusCategoryName === currentCategory.statusCategoryName;
          if (isCurrentCategory) {
            category.statusCategoryName = title;
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
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
      onClick={() => {
        setStatusCategories(
          produce(statusCategories, (draftState) => {
            draftState.selectedCategoryName =
              currentCategory.statusCategoryName;
          })
        );
      }}
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
          {currentCategory.statusCategoryName}
        </Box>
      )}

      {hover && currentCategory.statusCategoryName !== "Custom" && (
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
