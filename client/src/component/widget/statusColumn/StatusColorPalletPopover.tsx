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
  updateColorOnChoose?: boolean;
  position?: "bottom" | "top-start";
};

export default function StatusColorPalletPopover({
  children,
  position,
  isColorPalletOpen,
  handleSelectColor,
  onColorPalletClose,
  updateColorOnChoose,
}: Props) {
  function handleOnClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    currentColor: string
  ) {
    e.stopPropagation();
    handleSelectColor(currentColor);
  }

  return (
    <Popover
      isLazy
      returnFocusOnClose={false}
      isOpen={isColorPalletOpen}
      closeOnBlur={updateColorOnChoose ? true : false}
      autoFocus={updateColorOnChoose ? undefined : false}
      //   placement={position ? position : "top-start"}
      onClose={updateColorOnChoose ? onColorPalletClose : undefined}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent
        p="3"
        shadow="xl"
        width="230px"
        height="100px"
        borderWidth="1px"
        borderColor="blackAlpha.500"
        mt={position === "bottom" ? 2 : ""}
        onClick={(e) => e.stopPropagation()}
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
                    cursor="pointer"
                    bgColor={currentColor}
                    onClick={(e) => handleOnClick(e, currentColor)}
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
                    cursor="pointer"
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
