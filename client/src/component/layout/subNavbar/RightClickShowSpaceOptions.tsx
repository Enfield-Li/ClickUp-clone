import {
  Box,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo, useEffect, useRef } from "react";
import { Space } from "../../../types";
import AddMoreItemPopover from "./AddMoreItemPopover";

export const mainOptions = [
  "Rename",
  "Color & Avatar",
  "Copy link",
  "Add to favorites",
  "Duplicate",
  "/",
  "Templates",
  "Folder settings",
  "/",
  "Archive",
];

type Props = {
  space: Space;
  listId?: number;
  folderId?: number;
  children: React.ReactNode;
};

export default memo(RightClickShowSpaceOptions);
function RightClickShowSpaceOptions({
  space,
  listId,
  folderId,
  children,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    isOpen: isChildOpen,
    onClose: onChildClose,
    onOpen: onChildOpen,
  } = useDisclosure();

  const fontColor = useColorModeValue("black", "lightMain.100");
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  function handleRightClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
  }

  function deleteCurrentItem() {
    console.log("delete: ", { space, folderId, listId });
  }

  function renameItem() {
    console.log("renameItem", { space, folderId, listId });
  }

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={onClose}
      placement="right-end"
      returnFocusOnClose={true}
      closeOnBlur={isChildOpen ? false : true}
    >
      <PopoverTrigger>
        {/* Right click: https://stackoverflow.com/a/31113000/16648127 */}
        <Box onContextMenu={handleRightClick}>{children}</Box>
      </PopoverTrigger>

      <PopoverContent
        p="2"
        ref={ref}
        shadow="2xl"
        width="270px"
        fontSize="sm"
        color={fontColor}
        fontWeight="normal"
        // shadow="dark-lg"
        onMouseOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Create new */}
        <AddMoreItemPopover
          space={space}
          folderId={folderId}
          isPopoverOpen={isChildOpen}
          onPopoverOpen={onChildOpen}
          onPopoverClose={onChildClose}
          returnRefFn={() => ref.current && ref.current.focus()}
        >
          <Flex
            pr="1"
            rounded="md"
            opacity="80%"
            cursor="pointer"
            alignItems="center"
            justifyContent="space-between"
            _hover={{ bgColor: !isChildOpen && hoverBgColor }}
          >
            <Flex p="7px" pl="10px">
              <Box mr={2}>
                <i className="bi bi-plus-lg"></i>
              </Box>
              <Box>Create new</Box>
            </Flex>

            <Box fontSize="10px" opacity="70%" mr="1">
              <i className="bi bi-chevron-right"></i>
            </Box>
          </Flex>
        </AddMoreItemPopover>

        {/* More */}
        {mainOptions.map((option, index) =>
          option === "/" ? (
            <Box
              my="1"
              key={index}
              border="solid"
              borderWidth="1px"
              borderColor="blackAlpha.400"
            ></Box>
          ) : (
            <Flex
              p="7px"
              pl="10px"
              key={index}
              rounded="md"
              opacity="40%"
              onClick={renameItem}
              cursor="not-allowed"
              _hover={{ bgColor: !isChildOpen && hoverBgColor }}
            >
              <Box mr={2}>
                <i className="bi bi-exclamation-diamond"></i>
              </Box>
              <Box>{option}</Box>
            </Flex>
          )
        )}

        {/* Delete */}
        <Flex
          p="7px"
          pl="10px"
          rounded="md"
          opacity="100%"
          color="red.300"
          cursor="pointer"
          onClick={deleteCurrentItem}
          _hover={{ bgColor: !isChildOpen && hoverBgColor }}
        >
          <Box mr={2}>
            <i className="bi bi-trash3"></i>
          </Box>
          <Box>Delete</Box>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
