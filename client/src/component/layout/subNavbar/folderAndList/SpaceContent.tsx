import { Box, Center } from "@chakra-ui/react";
import { memo } from "react";
import { Space } from "../../../../types";
import determineListType from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = { space: Space };

export default memo(SpaceContent);
function SpaceContent({ space }: Props) {
  return (
    <Box>
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
        <Center>Create a Folder or List</Center>
      )}
    </Box>
  );
}
