import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Input,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { KeyboardEvent, memo, useState } from "react";
import {
  deleteStatusCategories,
  updateStatusCategoryName,
} from "../../../networkCalls";
import {
  StatusCategory,
  StatusCategoryState,
  UpdateStatusCategoryNameDTO,
} from "../../../types";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";

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
  setStatusCategoryState,
  statusCategoriesSelected,
}: Props) {
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentCategory.name);

  const fontColor = useColorModeValue("black", "lightMain.200");
  const color = currentCategory.isSelected ? "purple.500" : fontColor;

  function resetAll() {
    setEditing(false);
    setTitle(currentCategory.name);
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>): void {
    handleInputKeyPress({
      e,
      value: title,
      handleOnEsc: resetAll,
      handleOnEnter: handleEditCategoryName,
    });
  }

  function handleEditCategoryName() {
    if (title.toLowerCase() === currentCategory.name.toLowerCase()) {
      resetAll();
      return;
    }

    const isCategoryNameExist = statusCategoriesSelected.categories.some(
      (category) => category.name.toLowerCase() === title.toLowerCase()
    );
    if (isCategoryNameExist) {
      setStatusCategoryState(
        produce(statusCategoriesSelected, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === currentCategory.id) {
              draftState.errorMsg = "WHOOPS! THIS TEMPLATE NAME ALREADY EXISTS";
            }
          });
        })
      );
      return;
    }

    const dto: UpdateStatusCategoryNameDTO = {
      id: currentCategory.id,
      name: title,
    };

    updateStatusCategoryName(dto, () => {
      setEditing(false);
      setStatusCategoryState(
        produce(statusCategoriesSelected, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === currentCategory.id) {
              category.name = title;
            }
          });
        })
      );
    });
  }

  function handleOnBlur() {
    if (title) {
      handleEditCategoryName();
    } else {
      resetAll();
    }
  }

  function handleSelectCategory() {
    const category = statusCategoriesSelected.categories.find(
      (category) => category.isSelected
    );
    if (category?.id === currentCategory.id) return;

    setStatusCategoryState(
      produce(statusCategoriesSelected, (draftState) => {
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

  function handleEdit(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setEditing(true);
  }

  function handleDeleteCategory(e: React.MouseEvent<SVGElement, MouseEvent>) {
    e.stopPropagation();

    deleteStatusCategories(currentCategory.id, () => {
      setStatusCategoryState(
        produce(statusCategoriesSelected, (draftState) => {
          draftState.categories.forEach((category, index, arr) => {
            if (category.id === currentCategory.id) {
              arr.splice(index, 1);
            }
          });
        })
      );
    });
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
        <Tooltip label="Hover me" placement="right">
          <Input
            autoFocus
            height="30px"
            width="223px"
            value={title}
            variant="flushed"
            onBlur={handleOnBlur}
            onKeyDown={handleKeyPress}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Tooltip>
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
            onClick={handleEdit}
            _hover={{ color: "purple.500" }}
          >
            <i className="bi bi-pencil-fill"></i>
          </Center>

          {/* Close */}
          {!editing && (
            <Center fontSize="10px" _hover={{ color: "purple.500" }}>
              <CloseIcon onClick={(e) => handleDeleteCategory(e)} />
            </Center>
          )}
        </Flex>
      )}
    </Flex>
  );
}
