import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import { memo } from "react";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import {
  FolderCategory,
  ListCategory,
  Space,
  TEAM_STATE_ACTION,
} from "../../../../types";

type Props = { space: Space; list: ListCategory; folder?: FolderCategory };

export default memo(List);
function List({ space, folder, list }: Props) {
  const { colorMode } = useColorMode();
  const { teamState, teamStateDispatch } = useTeamStateContext();
  const hoverBgColor =
    colorMode === "dark" ? "rgb(36, 46, 52)" : "darkMain.200";
  const isListSelected = list.isSelected;

  function handleSelectList(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    teamStateDispatch({
      type: TEAM_STATE_ACTION.SELECT_LIST,
      payload: { listId: list.id, spaceId: space.id, folderId: folder?.id },
    });
  }

  return (
    <Flex
      pr="2"
      px="3px"
      py="5px"
      pl="15px"
      flexGrow="1"
      rounded="4px"
      cursor="pointer"
      position="relative"
      alignItems="center"
      ml={folder ? "35px" : "5"}
      justifyContent="space-between"
      onClick={handleSelectList}
      bgColor={isListSelected ? "customBlue.200" : ""}
      _hover={isListSelected ? undefined : { bgColor: hoverBgColor }}
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
        <Center fontSize="13px">{list.name}</Center>
        {list.isPrivate && (
          <Center fontSize="12px" color="gray" ml="1">
            <i className="bi bi-lock"></i>
          </Center>
        )}
      </Flex>

      <Center
        pr="2"
        fontSize="12px"
        color={isListSelected ? "lightMain.200" : "gray"}
      >
        {list.taskAmount}
      </Center>
    </Flex>
  );
}
