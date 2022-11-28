import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ListType } from "../../../../types";

type Props = { list: ListType; isSubList?: boolean };

export default memo(List);
function List({ list, isSubList }: Props) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const bgHoverColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";

  return (
    <Flex
      pr="2"
      my="1"
      p="3px"
      pl="15px"
      flexGrow="1"
      rounded="4px"
      cursor="pointer"
      position="relative"
      alignItems="center"
      ml={isSubList ? "35px" : "5"}
      justifyContent="space-between"
      bgColor={list.isSelected ? "customBlue.200" : ""}
      _hover={list.isSelected ? undefined : { bgColor: bgHoverColor }}
    >
      <Box
        left="-5px"
        width="8px"
        height="8px"
        rounded="full"
        position="absolute"
        bgColor={list.color ? list.color : ""}
        border={list.color ? "" : "1px white dashed"}
      ></Box>

      <Flex>
        <Center>{list.name}</Center>
        {list.isPrivate && (
          <Center fontSize="12px" color="gray" ml="1">
            <i className="bi bi-lock"></i>
          </Center>
        )}
      </Flex>

      <Center
        pr="2"
        fontSize="12px"
        color={list.isSelected ? "lightMain.400" : "gray"}
      >
        {list.taskAmount}
      </Center>
    </Flex>
  );
}
