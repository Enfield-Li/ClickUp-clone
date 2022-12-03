import { Box } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { defaultStatusCategories } from "../../hook/defaultStatuses";
import { StatusCategories } from "../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {};

export interface StatusCategoriesSelected {
  selectedCategoryName: string;
  statusCategories: StatusCategories;
}

export default memo(StatusColumnsDisplay);
function StatusColumnsDisplay({}: Props) {
  const [statusCategories, setStatusCategories] =
    useState<StatusCategoriesSelected>({
      selectedCategoryName: "Custom",
      statusCategories: defaultStatusCategories,
    });
  const selectedCategory = statusCategories.statusCategories.find(
    (category) => category.name === statusCategories.selectedCategoryName
  );

  useEffect(() => {
    setStatusCategories({
      selectedCategoryName: "Custom",
      statusCategories: defaultStatusCategories,
    });
  }, []);

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
