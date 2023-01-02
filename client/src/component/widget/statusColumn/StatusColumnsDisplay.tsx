import { Box } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { defaultStatusCategories } from "../../../hook/mockData";
import {
  CreateFolderState,
  CreateSpaceState,
  StatusCategories,
} from "../../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {
  setCreateSpace?: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
  setCreateFolder?: React.Dispatch<React.SetStateAction<CreateFolderState>>;
};

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({ setCreateSpace, setCreateFolder }: Props) {
  const [statusCategories, setStatusCategories] = useState<StatusCategories>(
    []
  );
  const selectedCategory = statusCategories.find(
    (category) => category.isSelected
  );

  useEffect(() => {
    setStatusCategories(defaultStatusCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCreateSpace &&
        setCreateSpace((prev) =>
          produce(prev, (draftState) => {
            draftState.selectedStatusColumns = selectedCategory.statusColumns;
          })
        );
      setCreateFolder &&
        setCreateFolder((prev) =>
          produce(prev, (draftState) => {
            draftState.selectedStatusColumns = selectedCategory.statusColumns;
          })
        );
    }
  }, [selectedCategory]);

  return (
    <>
      <Box height="100%" width="50%" pr="4">
        <StatusTemplate
          statusCategories={statusCategories}
          setStatusCategories={setStatusCategories}
        />
      </Box>

      <Box height="100%" width="50%">
        <ActiveStatuses
          selectedCategory={selectedCategory}
          setStatusCategories={setStatusCategories}
        />
      </Box>
    </>
  );
}
