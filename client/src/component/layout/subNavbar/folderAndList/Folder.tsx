import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import React, { memo } from "react";
import useSpaceListContext from "../../../../context/spaceList/useSpaceListContext";
import { FolderType, SPACE_LIST_ACTION } from "../../../../types";
import List from "./List";

type Props = { spaceId: number; folder: FolderType };

export default memo(Folder);
function Folder({ folder, spaceId }: Props) {
  const { colorMode } = useColorMode();
  const { spaceListDispatch } = useSpaceListContext();
  const hoverBgColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";

  function handleOpenFolder(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    folderId: number
  ) {
    e.stopPropagation();
    spaceListDispatch({
      payload: { spaceId, folderId },
      type: SPACE_LIST_ACTION.UPDATE_OPENED_FOLDER,
    });
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
        _hover={{ bgColor: hoverBgColor }}
        onClick={(e) => handleOpenFolder(e, folder.id)}
      >
        {/* Drag icon */}
        {/* {hover && (
  <Box position="absolute" left="-10px" color="gray" fontSize="22px">
    <i className="bi bi-grip-vertical"></i>
  </Box>
)} */}

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

      {folder.isOpen && (
        <Box>
          {folder.allLists.map((list) => (
            <Box key={list.id}>
              <List list={list} isSubList={true} />
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
