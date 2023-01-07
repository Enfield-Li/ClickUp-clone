import { Center, Flex, useColorModeValue } from "@chakra-ui/react";
import React from "react";

type Props = {
  title: string;
  handleClick: () => void;
  children: React.ReactNode;
};

export default function ReviewCreateSpaceItem({
  title,
  children,
  handleClick,
}: Props) {
  const itemBgColor = useColorModeValue("white", "darkMain.100");
  const itemHoverBgColor = useColorModeValue("lightMain.100", "darkMain.300");

  return (
    <Flex
      px="3"
      height="50px"
      cursor="pointer"
      borderWidth="1px"
      onClick={handleClick}
      bgColor={itemBgColor}
      borderColor="blackAlpha.400"
      justifyContent="space-between"
      _hover={{ bgColor: itemHoverBgColor }}
    >
      <Center fontWeight="semibold" fontSize="13px">
        {title}
      </Center>

      <Flex alignItems="center" fontSize="12px" fontWeight="semibold">
        {children}
      </Flex>
    </Flex>
  );
}
