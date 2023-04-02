import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import { useModalControl } from "../../../../context/modalControl/useModalControl";
import { useTeam } from "../../../../context/team/useTeam";
import { Space } from "../../../../types";
import { determineFolderType } from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = {
  space: Space;
};

export default memo(SpaceContent);
function SpaceContent({ space }: Props) {
  const { setCreateFolderInfo, setCreateListInfo } = useTeam();
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
              setCreateFolderInfo({
                spaceId: space.id,
                defaultStatusCategoryId: space.defaultStatusCategoryId,
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
              setCreateListInfo({
                spaceId: space.id,
                defaultStatusCategoryId: space.defaultStatusCategoryId,
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
