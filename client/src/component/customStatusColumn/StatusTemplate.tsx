import { Box } from "@chakra-ui/react";
import React, { memo } from "react";
import { StatusCategories } from "./StatusColumnsDisplay";
import CategoryList from "./CategoryList";

type Props = {
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default memo(StatusTemplate);
function StatusTemplate({ statusCategories, setStatusCategories }: Props) {
  return (
    <Box height="80%">
      {statusCategories?.statusColumnCategories.map(
        (currentCategory, index) => (
          <Box key={index}>
            <CategoryList
              currentCategory={currentCategory}
              statusCategories={statusCategories}
              setStatusCategories={setStatusCategories}
            />
          </Box>
        )
      )}
    </Box>
  );
}
