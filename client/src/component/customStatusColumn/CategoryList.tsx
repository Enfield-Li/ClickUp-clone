import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import { StatusColumnCategory } from "../../types";
import { deepCopy } from "../../utils/deepCopy";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  currentCategory: StatusColumnCategory;
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default function CategoryList({
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

  function handleClickToEdit() {
    setEditing(true);
  }

  function handleEditTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setStatusCategories(
      produce(statusCategories, (draftState) => {
        draftState.statusColumnCategories.forEach((category) => {
          const isCurrentCategory =
            category.statusCategoryName === currentCategory.statusCategoryName;
          if (isCurrentCategory) {
            category.statusCategoryName = newTitle;
            console.log(deepCopy(category));
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
          onChange={handleEditTitle}
          onBlur={() => setEditing(false)}
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
            onClick={handleClickToEdit}
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
