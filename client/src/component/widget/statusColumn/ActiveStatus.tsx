import { Box, Center, Flex, Input, useDisclosure } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import {
  updateStatusColumnColor,
  updateStatusColumnTitle,
} from "../../../networkCalls";
import {
  StatusCategory,
  StatusCategoryState,
  StatusColumn,
  UpdateStatusColumnColorDTO,
  UpdateStatusColumnTitleDTO,
} from "../../../types";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";
import StatusColorPallet from "./StatusColorPallet";

type Props = {
  selectedCategory: StatusCategory;
  currentStatusColumn: StatusColumn;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(ActiveStatus);
function ActiveStatus({
  selectedCategory,
  currentStatusColumn,
  setStatusCategoryState,
}: Props) {
  const [title, setTitle] = useState("");
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const {
    isOpen: isColorPalletOpen,
    onOpen: onColorPalletOpen,
    onClose: onColorPalletClose,
  } = useDisclosure();

  useEffect(() => {
    setTitle(currentStatusColumn.title);
  }, [currentStatusColumn]);

  function handleFinishedEdit() {
    setEditing(false);
    onColorPalletClose();
    if (!title) return;
    updateStatusTitle();
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    handleInputKeyPress({
      e,
      value: title,
      handleOnEnter: handleFinishedEdit,
      handleOnEsc: () => {
        setEditing(false);
        onColorPalletClose();
        setTitle(currentStatusColumn.title);
      },
    });
  }

  function updateStatusTitle() {
    if (title === currentStatusColumn.title) {
      return;
    }
    const dto: UpdateStatusColumnTitleDTO = {
      id: currentStatusColumn.id!,
      title,
    };

    updateStatusColumnTitle(dto, () =>
      setStatusCategoryState((prev) =>
        produce(prev, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === selectedCategory.id) {
              category.statusColumns.forEach((column) => {
                if (column.id === currentStatusColumn.id) {
                  column.title = title;
                }
              });
            }
          });
        })
      )
    );
  }

  function handleSelectColor(selectedColor: string) {
    const dto: UpdateStatusColumnColorDTO = {
      id: currentStatusColumn.id!,
      color: selectedColor,
    };

    updateStatusColumnColor(dto, () =>
      setStatusCategoryState((prev) =>
        produce(prev, (draftState) => {
          draftState.categories.forEach((category) => {
            if (category.id === selectedCategory.id) {
              category.statusColumns.forEach((column) => {
                if (column.id === currentStatusColumn.id) {
                  column.color = selectedColor;
                }
              });
            }
          });
        })
      )
    );
  }

  function handleOpenOption(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <Flex
      px="2"
      my="8px"
      rounded="md"
      height="25px"
      fontSize="13px"
      cursor="pointer"
      borderWidth="1px"
      fontWeight="semibold"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      onClick={() => setEditing(true)}
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
    >
      <Flex alignItems="center">
        {/* Color */}
        <StatusColorPallet
          updateColor={!editing && true}
          isColorPalletOpen={isColorPalletOpen}
          handleSelectColor={handleSelectColor}
          onColorPalletClose={onColorPalletClose}
        >
          <Box
            mr="6px"
            width="10px"
            rounded="sm"
            height="10px"
            onClick={(e) => {
              e.stopPropagation();
              onColorPalletOpen();
            }}
            bgColor={currentStatusColumn.color}
            onBlurCapture={(e) => console.log("blur")}
          ></Box>
        </StatusColorPallet>

        {/* Title */}
        {editing ? (
          <Box>
            <Input
              autoFocus
              color="gray"
              height="20px"
              value={title}
              fontSize="13px"
              variant="unstyled"
              textTransform="uppercase"
              onKeyDown={handleKeyPress}
              onBlur={handleFinishedEdit}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        ) : (
          <Box color={currentStatusColumn.color}>
            {currentStatusColumn.title.toUpperCase()}
          </Box>
        )}

        {/* Edit */}
        {hover && !editing && (
          <Box ml="2" opacity="60%" fontSize="10px">
            <i className="bi bi-pencil-fill"></i>
          </Box>
        )}
      </Flex>

      {/* Options */}
      <Center _hover={{ color: "purple.500" }} onClick={handleOpenOption}>
        <i className="bi bi-three-dots"></i>
      </Center>
    </Flex>
  );
}
