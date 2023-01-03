import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Flex,
  Center,
} from "@chakra-ui/react";
import { spaceColors3D } from "../../../media/colors";

type Props = { 
  children: React.ReactNode;
  isColorPalletOpen: boolean;
  onColorPalletClose: () => void;
  handleSelectColor: (color: string) => void;
};

export default function StatusColorPallet({
  children, 
  isColorPalletOpen,
  onColorPalletClose,
  handleSelectColor,
}: Props) {
  return (
    <Popover
      isLazy
      autoFocus={false}
      closeOnBlur={false}
      placement="top-start"
      returnFocusOnClose={false}
      isOpen={isColorPalletOpen}
      onClose={onColorPalletClose}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

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
  );
}
