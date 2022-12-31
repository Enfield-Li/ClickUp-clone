import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { memo } from "react";
import { useLocation } from "react-router-dom";

type Props = { left: string; right: string };

export default memo(CreateFolderItem);
function CreateFolderItem({ left, right }: Props) {
  const hoverBgColor = useColorModeValue("lightMain.200", "darkMain.200");

  return (
    <Flex
      p="5"
      px="4"
      fontSize="small"
      borderBottomWidth="1px"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      _hover={{ bgColor: hoverBgColor }}
    >
      <Box>{left}</Box>
      <Box>{right}</Box>
    </Flex>
  );
}
