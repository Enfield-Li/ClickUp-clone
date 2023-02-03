import {
  Box,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { memo } from "react";

type Props = {
  spaceId: number;
  listId?: number;
  folderId?: number;
  children: React.ReactNode;
  isChildOpen: boolean;
  onChildClose: () => void;
  onChildOpen: () => void;
  returnRefFn: () => void;
};

const createNewOptions = [
  "List",
  "/",
  "Doc",
  "Whiteboard",
  "/",
  "Folder",
  "From template",
  "import",
];

export default memo(CreateNewOptions);
function CreateNewOptions({
  listId,
  spaceId,
  folderId,
  isChildOpen,
  onChildClose,
  onChildOpen,
  children,
  returnRefFn,
}: Props) {
  const fontColor = useColorModeValue("black", "lightMain.100");
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  return (
    <Popover
      isLazy
      isOpen={isChildOpen}
      onOpen={onChildOpen}
      onClose={onChildClose}
      placement="right-start"
      returnFocusOnClose={true}
    >
      <PopoverTrigger>
        <Box>{children}</Box>
      </PopoverTrigger>

      <Portal>
        <PopoverContent
          p="2"
          width="220px"
          fontSize="sm"
          shadow="dark-lg"
          color={fontColor}
          onBlur={returnRefFn}
          onMouseOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {createNewOptions.map((option, index) =>
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
                opacity="80%"
                // onClick={renameItem}
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
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
