import { Box, Center, Flex, useColorMode } from "@chakra-ui/react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../../constant";
import useAuthContext from "../../../../context/auth/useAuthContext";
import { FolderType } from "../../../../types";
import List from "./List";

type Props = { folder: FolderType };

export default memo(Folder);
function Folder({ folder }: Props) {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const { authDispatch } = useAuthContext();
  const hoverBgColor = colorMode === "dark" ? "darkMain.300" : "darkMain.200";

  function handleNavigateToList(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    listId: number
  ) {
    e.stopPropagation();
    navigate(CLIENT_ROUTE.TASK_BOARD + `/${listId}`, { replace: true });
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
        <Center
          fontSize="13px"
          onClick={(e) => handleNavigateToList(e, folder.id)}
        >
          {folder.name}
        </Center>

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
