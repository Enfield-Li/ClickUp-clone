import { Box, Button, Flex, Input, useDisclosure } from "@chakra-ui/react";
import produce from "immer";
import React, { memo, useState } from "react";
import { getRandomSpaceColor } from "../../../media/colors";
import { CreateStatusColumnForCategory } from "../../../networkCalls";
import {
  CreateStatusColumnForCategoryDTO,
  StatusCategory,
  StatusCategoryState,
} from "../../../types";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";
import StatusColorPallet from "./StatusColorPallet";

type Props = {
  selectedCategory?: StatusCategory;
  statusCategoriesAmount: number | undefined;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(AddStatus);
function AddStatus({
  selectedCategory,
  setStatusCategoryState,
  statusCategoriesAmount,
}: Props) {
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);
  // https://beta.reactjs.org/apis/react/useState#avoiding-recreating-the-initial-state
  const [selectedColor, setSelectedColor] = useState(getRandomSpaceColor);
  const {
    isOpen: isColorPalletOpen,
    onOpen: onColorPalletOpen,
    onClose: onColorPalletClose,
  } = useDisclosure();

  function handleSelectColor(selectedColor: string) {
    setSelectedColor(selectedColor);
  }

  function resetAll() {
    setTitle("");
    setCreating(false);
    setSelectedColor(getRandomSpaceColor);
  }

  function handleOpenEdit() {
    onColorPalletOpen();
    setCreating(true);
  }

  function handleOnBlur(e: React.FocusEvent<HTMLDivElement, Element>) {
    // Prevent firing the blur event on children: https://stackoverflow.com/a/60094794/16648127
    // blur event.relatedTarget returns null: https://stackoverflow.com/a/42764495/16648127
    if (!title && !e.currentTarget.contains(e.relatedTarget)) {
      resetAll();
    } else if (title && !e.currentTarget.contains(e.relatedTarget)) {
      addStatus();
      setSelectedColor(getRandomSpaceColor);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    handleInputKeyPress({
      e,
      value: title,
      handleOnEsc: resetAll,
      handleOnEnter: addStatus,
    });
  }

  async function addStatus() {
    const isTitleExist = selectedCategory?.statusColumns.some(
      (column) => column.title.toLowerCase() === title.toLowerCase()
    );
    if (isTitleExist) {
      setStatusCategoryState((prev) =>
        produce(prev, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === selectedCategory?.id) {
              const isTitleExist = category.statusColumns.some(
                (column) => column.title.toLowerCase() === title.toLowerCase()
              );
              if (isTitleExist) {
                draftState.errorMsg = "WHOOPS! STATUS NAME IS ALREADY TAKEN";
                return;
              }
            }
          });
        })
      );
      return;
    }

    if (!selectedCategory) throw new Error("Cannot find original category");

    const orderIndex = statusCategoriesAmount ? statusCategoriesAmount + 1 : 1;
    const dto: CreateStatusColumnForCategoryDTO = {
      title,
      orderIndex,
      color: selectedColor,
      categoryId: selectedCategory.id,
    };

    CreateStatusColumnForCategory(dto, () => {
      setStatusCategoryState((prev) =>
        produce(prev, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === selectedCategory.id) {
              setTitle("");
              category.statusColumns.push(dto);
            }
          });
        })
      );
    });
  }

  return (
    <Box>
      {creating ? (
        <Flex
          my="1"
          px="2"
          rounded="md"
          height="25px"
          fontSize="13px"
          cursor="pointer"
          borderWidth="1px"
          alignItems="center"
          fontWeight="semibold"
          borderColor="blackAlpha.500"
          onBlur={handleOnBlur}
        >
          {/* Color */}
          <StatusColorPallet
            isColorPalletOpen={isColorPalletOpen}
            handleSelectColor={handleSelectColor}
            onColorPalletClose={onColorPalletClose}
          >
            <Box
              mr="6px"
              width="10px"
              rounded="sm"
              height="10px"
              bgColor={selectedColor}
            ></Box>
          </StatusColorPallet>

          {/* Title */}
          <Input
            autoFocus
            width="100%"
            height="25px"
            value={title}
            fontSize="13px"
            variant="unstyled"
            rounded={undefined}
            fontWeight="semibold"
            textTransform="uppercase"
            onKeyDown={handleKeyPress}
            onChange={(e) => setTitle(e.target.value)}
          />

          {title && (
            <Box fontSize="10px" opacity="60%">
              <i className="bi bi-arrow-return-left"></i>
            </Box>
          )}
        </Flex>
      ) : (
        <Button
          my="1"
          size="sm"
          height="25px"
          rounded="sm"
          color="lightMain.100"
          bgColor="customBlue.200"
          onClick={handleOpenEdit}
          _hover={{ bgColor: "customBlue.100" }}
        >
          + Add status
        </Button>
      )}
    </Box>
  );
}
