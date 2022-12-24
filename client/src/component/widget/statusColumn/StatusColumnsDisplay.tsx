import { Box } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { defaultTeamStatusColumns } from "../../../hook/mockData";
import { CreateSpace, TeamStatusColumns } from "../../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export interface StatusCategoriesSelected {
  selectedCategoryName: string;
  statusCategories: TeamStatusColumns;
}

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({ setCreateSpace }: Props) {
  const [statusCategories, setStatusCategories] =
    useState<StatusCategoriesSelected>({
      selectedCategoryName: "Custom",
      statusCategories: defaultTeamStatusColumns,
    });
  const selectedCategory = statusCategories.statusCategories.find(
    (category) => category.name === statusCategories.selectedCategoryName
  );

  useEffect(() => {
    setStatusCategories({
      selectedCategoryName: "Custom",
      statusCategories: defaultTeamStatusColumns,
    });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setCreateSpace((prev) =>
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
          statusCategoriesSelected={statusCategories}
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
