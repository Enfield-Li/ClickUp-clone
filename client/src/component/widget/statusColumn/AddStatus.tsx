import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import produce from "immer";
import React, { memo, useState } from "react";
import { getRandomSpaceColor, spaceColors3D } from "../../../media/colors";
import { StatusCategoryState, StatusColumn } from "../../../types";
import { getRandomNumberNoLimit } from "../../../utils/getRandomNumber";

type Props = {
  selectedCategoryName: string | undefined;
  statusCategoriesAmount: number | undefined;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(AddStatus);
function AddStatus({
  selectedCategoryName,
  setStatusCategoryState,
  statusCategoriesAmount,
}: Props) {
  const [title, setTitle] = useState("");
  const [adding, setAdding] = useState(false);
  // https://beta.reactjs.org/apis/react/useState#avoiding-recreating-the-initial-state
  const [color, setColor] = useState(getRandomSpaceColor);
  const { isOpen, onClose, onOpen } = useDisclosure();

  function handleSelectColor(selectedColor: string) {
    setColor(selectedColor);
  }
  const errMsg = "WHOOPS! STATUS NAME IS ALREADY TAKEN";
  // <i className="bi bi-exclamation-triangle-fill"></i>;

  function resetAll() {
    setTitle("");
    setAdding(false);
    setColor(getRandomSpaceColor);
  }

  function handleOpenEdit() {
    onOpen();
    setAdding(true);
  }

  function handleOnBlur(e: React.FocusEvent<HTMLDivElement, Element>) {
    // Prevent firing the blur event on children: https://stackoverflow.com/a/60094794/16648127
    // blur event.relatedTarget returns null: https://stackoverflow.com/a/42764495/16648127
    if (!title && !e.currentTarget.contains(e.relatedTarget)) {
      resetAll();
    } else if (title) {
      setTitle("");
      handleAddStatus();
      setColor(getRandomSpaceColor);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.code === "NumpadEnter") {
      handleAddStatus();
    }
  }

  async function handleAddStatus() {
    const orderIndex = statusCategoriesAmount ? statusCategoriesAmount + 1 : 1;
    const newColumn: StatusColumn = {
      id: getRandomNumberNoLimit(),
      color,
      orderIndex,
      title,
    };
    setStatusCategoryState((prev) =>
      produce(prev, (draftState) => {
        draftState.categories.forEach((category) => {
          if (category.name === selectedCategoryName) {
            const isTitleExist = category.statusColumns.some(
              (column) => column.title.toLowerCase() === title.toLowerCase()
            );
            if (isTitleExist) {
              draftState.errorMsg = "WHOOPS! STATUS NAME IS ALREADY TAKEN";
              return;
            }

            category.statusColumns.push(newColumn);
          }
        });
      })
    );
  }

  return (
    <Box>
      {adding ? (
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
          {/* Square */}
          <Popover
            isOpen={isOpen}
            autoFocus={false}
            onClose={onClose}
            closeOnBlur={false}
            placement="top-start"
            returnFocusOnClose={false}
          >
            <PopoverTrigger>
              <Box
                mr="6px"
                width="10px"
                rounded="sm"
                height="10px"
                bgColor={color}
                // bgColor={color}
              ></Box>
            </PopoverTrigger>

            <PopoverContent
              p="3"
              shadow="xl"
              width="230px"
              height="100px"
              borderWidth="1px"
              borderColor="blackAlpha.500"
            >
              <Flex flexDir="column" alignItems="center" justifyContent="">
                {spaceColors3D.map((colors, index) => (
                  <Flex key={index} my="6px">
                    {colors.map((currentColor, index) =>
                      currentColor ? (
                        <Box
                          mx="6px"
                          shadow="md"
                          key={index}
                          width="13px"
                          rounded="sm"
                          height="13px"
                          bgColor={currentColor}
                          onClick={() => handleSelectColor(currentColor)}
                        ></Box>
                      ) : (
                        <Center
                          mx="6px"
                          key={index}
                          shadow="md"
                          width="13px"
                          rounded="sm"
                          height="13px"
                          opacity="60%"
                          fontSize="13px"
                          _hover={{ bgColor: "blackAlpha.500", color: "white" }}
                        >
                          <i className="bi bi-eyedropper"></i>
                        </Center>
                      )
                    )}
                  </Flex>
                ))}
              </Flex>
            </PopoverContent>
          </Popover>

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
            onKeyPress={handleKeyPress}
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
