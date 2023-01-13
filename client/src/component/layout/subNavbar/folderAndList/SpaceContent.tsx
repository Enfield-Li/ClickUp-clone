import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import useTeamStateContext from "../../../../context/team/useTeamContext";
import { Space } from "../../../../types";
import determineListType from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = {
  space: Space;
};

export default memo(SpaceContent);
function SpaceContent({ space }: Props) {
  const {
    modalControls: { onCreateListModalOpen, onCreateFolderModalOpen },
  } = useTeamStateContext();

  return (
    <Box mb="2">
      {space.allListOrFolder.length ? (
        space.allListOrFolder.map((folder) => (
          <Box key={folder.id}>
            <Box>
              {!determineListType(folder) ? (
                <Folder space={space} folder={folder} />
              ) : (
                <List space={space} list={folder} />
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
            onClick={onCreateFolderModalOpen}
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
            onClick={onCreateListModalOpen}
          >
            List
          </Box>
        </Center>
      )}
    </Box>
  );
}
