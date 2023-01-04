import { Box, useColorModeValue, Flex } from "@chakra-ui/react";

type Props = {
  children: React.ReactNode;
  onClickHandler: React.MouseEventHandler<HTMLDivElement>;
};

export default function StatusColumnOption({
  children,
  onClickHandler,
}: Props) {
  const hoverBgColor = useColorModeValue("lightMain.100", "darkMain.200");
  return (
    <Flex
      mx="2"
      px="2"
      py="7px"
      rounded="md"
      onClick={(e) => {
        e.stopPropagation();
        onClickHandler(e);
      }}
      _hover={{ bgColor: hoverBgColor }}
    >
      {children}
    </Flex>
  );
}
