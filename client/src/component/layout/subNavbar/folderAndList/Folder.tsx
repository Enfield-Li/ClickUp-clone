import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import React, { memo, useState } from "react";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { FolderCategory, Space, TEAM_STATE_ACTION } from "../../../../types";
import List from "./List";

type Props = { space: Space; folder: FolderCategory };

export default memo(Folder);
function Folder({ space, folder }: Props) {
  const { colorMode } = useColorMode();
  const [hover, setHover] = useState(false);
  const { teamState, teamStateDispatch } = useTeamStateContext();
  const hoverBgColor =
    colorMode === "dark" ? "rgb(36, 46, 52)" : "darkMain.200";

  function handleOpenFolder(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    folderId: number
  ) {
    e.stopPropagation();
    teamStateDispatch({
      payload: { folderId, spaceId: space.id },
      type: TEAM_STATE_ACTION.OPEN_FOLDER,
    });
  }

  function handleAddCategory(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    e.stopPropagation();
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <Flex
        p="5px"
        pl="3"
        rounded="4px"
        fontSize="15px"
        cursor="pointer"
        position="relative"
        alignItems="center"
        justifyContent="space-between"
        _hover={{ bgColor: hoverBgColor }}
        onMouseLeave={() => setHover(false)}
        onMouseOverCapture={() => setHover(true)}
        onClick={(e) => handleOpenFolder(e, folder.id)}
      >
        {/* Drag icon */}
        {/* {hover && (
          <Box position="absolute" left="-10px" color="gray" fontSize="22px">
            <i className="bi bi-grip-vertical"></i>
          </Box>
        )} */}

        <Flex alignItems="center">
          {/* Folder icon */}
          <Box mr="2" color={folder.color ? folder.color : ""}>
            {folder.isOpen ? (
              <Box>
                <i className="bi bi-folder2-open"></i>
              </Box>
            ) : (
              <Box>
                <i className="bi bi-folder-fill"></i>
              </Box>
            )}
          </Box>

          {/* name */}
          <Center fontSize="13px">{folder.name}</Center>

          {folder.isPrivate && (
            <Center fontSize="12px" color="gray" ml="1">
              <i className="bi bi-lock"></i>
            </Center>
          )}
        </Flex>

        {hover && (
          <Center
            pb="1"
            mr="8px"
            width="15px"
            height="15px"
            rounded="full"
            fontSize="15px"
            color="darkMain.200"
            bgColor="lightMain.400"
            fontWeight="extrabold"
            _hover={{ bgColor: "purple.500" }}
            onClick={(e) => handleAddCategory(e)}
          >
            +
          </Center>
        )}
      </Flex>

      {folder.isOpen && (
        <Box>
          {folder.allLists.map((list) => (
            <Box key={list.id}>
              <List space={space} folder={folder} list={list} />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
