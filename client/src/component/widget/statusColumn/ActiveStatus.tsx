import { Box, Flex, Input, useDisclosure } from "@chakra-ui/react";
import { memo, useState } from "react";
import {
  StatusCategory,
  StatusCategoryState,
  StatusColumn,
} from "../../../types";
import { handleInputKeyPress } from "../../../utils/handleInputKeyPress";
import { handleSelectColor } from "./actions/handleSelectColor";
import { handleUpdateStatusTitle } from "./actions/updateStatusTitle";
import ActiveStatusOptions from "./ActiveStatusOptions";
import StatusColorPalletPopover from "./StatusColorPalletPopover";

type Props = {
  selectedCategory?: StatusCategory;
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
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(currentStatusColumn.title);
  const {
    isOpen: isColorPalletOpen,
    onOpen: onColorPalletOpen,
    onClose: onColorPalletClose,
  } = useDisclosure();

  //   useEffect(() => {
  //     setTitle(currentStatusColumn.title);
  //   }, [currentStatusColumn]);

  function handleFinishedEdit() {
    setEditing(false);
    if (!title) return;
    updateStatusTitle();
  }

  function handleOpenColorPallet(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    e.stopPropagation();
    onColorPalletOpen();
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
    handleUpdateStatusTitle({
      title,
      setTitle,
      setEditing,
      selectedCategory,
      currentStatusColumn,
      setStatusCategoryState,
    });
  }

  function selectColorHandler(selectedColor: string) {
    handleSelectColor({
      selectedColor,
      selectedCategory,
      currentStatusColumn,
      setStatusCategoryState,
    });
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
        <StatusColorPalletPopover
          isColorPalletOpen={isColorPalletOpen}
          handleSelectColor={selectColorHandler}
          updateColorOnChoose={!editing && true}
          onColorPalletClose={onColorPalletClose}
        >
          <Box
            mr="6px"
            width="10px"
            rounded="sm"
            height="10px"
            bgColor={currentStatusColumn.color}
            onClick={
              !currentStatusColumn.markAsClosed
                ? handleOpenColorPallet
                : undefined
            }
          ></Box>
        </StatusColorPalletPopover>

        {/* Title */}
        {editing ? (
          <Box position="relative" height="20px" width="200px" mb="1px">
            <Input
              autoFocus
              color="gray"
              value={title}
              fontSize="13px"
              variant="unstyled"
              position="absolute"
              textTransform="uppercase"
              onKeyDown={handleKeyPress}
              onBlur={handleFinishedEdit}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        ) : (
          <Box color={currentStatusColumn.color} mb="2px">
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
      <ActiveStatusOptions
        setEditing={setEditing}
        selectedCategory={selectedCategory}
        onColorPalletOpen={onColorPalletOpen}
        currentStatusColumn={currentStatusColumn}
        setStatusCategoryState={setStatusCategoryState}
      />
    </Flex>
  );
}
