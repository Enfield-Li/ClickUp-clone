import {
  Box,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { memo } from "react";

type Props = {
  spaceId: number;
  listId?: number;
  folderId?: number;
  children: React.ReactNode;
};

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

export default memo(RightClickShowSpaceOptions);
function RightClickShowSpaceOptions({
  listId,
  spaceId,
  folderId,
  children,
}: Props) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  function handleRightClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    onOpen();
  }

  function deleteCurrentItem() {
    console.log("delete: ", { spaceId, folderId, listId });
  }

  function createNewItem() {
    console.log("createNewItem: ", { spaceId, folderId, listId });
  }

  function renameItem() {
    console.log("renameItem", { spaceId, folderId, listId });
  }

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={onClose}
      placement="right-end"
      returnFocusOnClose={false}
    >
      <PopoverTrigger>
        {/* Right click: https://stackoverflow.com/a/31113000/16648127 */}
        <Box onContextMenu={handleRightClick}>{children}</Box>
      </PopoverTrigger>

      <PopoverContent
        p="2"
        width="270px"
        fontSize="sm"
        onMouseOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Create new */}
        <Flex
          pr="1"
          rounded="md"
          opacity="80%"
          cursor="pointer"
          alignItems="center"
          onClick={createNewItem}
          justifyContent="space-between"
          _hover={{ bgColor: hoverBgColor }}
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

        {mainOptions.map((option, index) =>
          option === "/" ? (
            <Box
              my="1"
              border="solid"
              borderColor="blackAlpha.400"
              borderWidth="1px"
            ></Box>
          ) : (
            <Flex
              p="7px"
              pl="10px"
              key={index}
              rounded="md"
              opacity="80%"
              onClick={renameItem}
              cursor="not-allowed"
              _hover={{ bgColor: hoverBgColor }}
            >
              <Box mr={2}>
                <i className="bi bi-exclamation-diamond"></i>
              </Box>
              <Box>{option}</Box>
            </Flex>
          )
        )}

        <Flex
          p="7px"
          pl="10px"
          rounded="md"
          opacity="80%"
          color="red.300"
          cursor="pointer"
          onClick={deleteCurrentItem}
          _hover={{ bgColor: hoverBgColor }}
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
