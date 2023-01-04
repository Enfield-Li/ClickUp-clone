import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import React, { memo } from "react";
import { useLocation } from "react-router-dom";

type Props = { left: string; children: React.ReactNode };

export default memo(CreateFolderItem);
function CreateFolderItem({ left, children }: Props) {
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.200");

  return (
    <Flex
      px="4"
      height="60px"
      fontSize="small"
      alignItems="center"
      borderBottomWidth="1px"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      _hover={{ bgColor: hoverBgColor }}
    >
      <Box>{left}</Box>
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
