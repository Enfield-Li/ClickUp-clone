import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import { useModalControl } from "../../../../context/modalControl/useModalControl";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { Space, TEAM_STATE_ACTION } from "../../../../types";
import { determineFolderType } from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = {
  space: Space;
};

export default memo(SpaceContent);
function SpaceContent({ space }: Props) {
  const { teamStateDispatch } = useTeamStateContext();
  const { onCreateListModalOpen, onCreateFolderModalOpen } = useModalControl();

  return (
    <Box mb="2">
      {space.allListOrFolder.length ? (
        space.allListOrFolder.map((listOrFolder) => (
          <Box
            key={
              (determineFolderType(listOrFolder) ? "folder" : "list") +
              listOrFolder.id
            }
          >
            <Box>
              {determineFolderType(listOrFolder) ? (
                <Folder space={space} folder={listOrFolder} />
              ) : (
                <List space={space} list={listOrFolder} />
              )}
            </Box>
          </Box>
        ))
      ) : (
        <Center>
          Create a<span>&nbsp;</span>
          <Box
            cursor="pointer"
            borderBottomWidth="1px"
            borderBottomColor="white"
            onClick={(e) => {
              onCreateFolderModalOpen();
              teamStateDispatch({
                type: TEAM_STATE_ACTION.SET_CREATE_FOLDER_INFO,
                payload: {
                  spaceId: space.id,
                  defaultStatusCategoryId: space.defaultStatusCategoryId,
                },
              });
            }}
          >
            Folder
          </Box>
          <span>&nbsp;</span>
          or
          <span>&nbsp;</span>
          <Box
            cursor="pointer"
            borderBottomWidth="1px"
            borderBottomColor="white"
            onClick={() => {
              onCreateListModalOpen();
              teamStateDispatch({
                type: TEAM_STATE_ACTION.SET_CREATE_LIST_INFO,
                payload: {
                  spaceId: space.id,
                  defaultStatusCategoryId: space.defaultStatusCategoryId,
                },
              });
            }}
          >
            List
          </Box>
        </Center>
      )}
    </Box>
  );
}
