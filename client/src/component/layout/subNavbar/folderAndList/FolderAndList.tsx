import { Box } from "@chakra-ui/react";
import { memo } from "react";
import { FolderCategory, ListCategory } from "../../../../types";
import determineListType from "./determineList";
import Folder from "./Folder";
import List from "./List";

type Props = { spaceId: number; folder: FolderCategory | ListCategory };

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
