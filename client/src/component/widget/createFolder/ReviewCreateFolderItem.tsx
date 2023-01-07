import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import React, { memo } from "react";

type Props = {
  title: string;
  handleClick: () => void;
  children: React.ReactNode;
};

export default memo(ReviewCreateFolderItem);
function ReviewCreateFolderItem({ title, children, handleClick }: Props) {
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.200");

  return (
    <Flex
      px="4"
      height="60px"
      fontSize="small"
      alignItems="center"
      onClick={handleClick}
      borderBottomWidth="1px"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      _hover={{ bgColor: hoverBgColor }}
    >
      <Box>{title}</Box>
      <Center flexDir="row">
        {children}

        {/* Right arrow */}
        <Box ml="3" fontSize="18px" opacity="80%">
          <i className="bi bi-chevron-right"></i>
        </Box>
      </Center>
    </Flex>
  );
}
