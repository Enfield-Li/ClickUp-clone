import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import { memo } from "react";
import useSpaceListContext from "../../../../context/team/useTeamContext";
import { ListCategory, TEAM_STATE_ACTION } from "../../../../types";

type Props = { list: ListCategory; isSubList?: boolean };

export default memo(List);
function List({ list, isSubList }: Props) {
  const { colorMode } = useColorMode();
  const { TeamStateDispatch: spaceListDispatch } = useSpaceListContext();
  const bgHoverColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";

  function handleSelectList(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    spaceListDispatch({
      payload: { listId: list.id },
      type: TEAM_STATE_ACTION.UPDATE_SELECTED_LIST,
    });
  }

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
      onClick={handleSelectList}
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
        color={list.isSelected ? "lightMain.200" : "gray"}
      >
        {list.taskAmount}
      </Center>
    </Flex>
  );
}
