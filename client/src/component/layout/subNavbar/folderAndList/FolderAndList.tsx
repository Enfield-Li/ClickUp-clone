import { Box } from "@chakra-ui/react";
import { memo } from "react";
import { FolderType, ListType } from "../../../../types";
import determineListType from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = { spaceId: number; folder: FolderType | ListType };

export default memo(FolderAndList);
function FolderAndList({ folder, spaceId }: Props) {
  const isList = determineListType(folder);

  return (
    <Box>
      {!isList ? (
        <Folder folder={folder} spaceId={spaceId} />
      ) : (
        <List list={folder} />
      )}
    </Box>
  );
}
