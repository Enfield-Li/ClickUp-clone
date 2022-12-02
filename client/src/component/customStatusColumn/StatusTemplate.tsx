import { Box } from "@chakra-ui/react";
import React from "react";
import { StatusCategories } from "./StatusColumnsDisplay";
import StatusItemTitle from "./StatusItemTitle";

type Props = {
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default function StatusTemplate({
  statusCategories,
  setStatusCategories,
}: Props) {
  return (
    <Box height="80%">
      {statusCategories?.statusColumnCategories.map((statusColumn) => (
        <StatusItemTitle
          statusColumn={statusColumn}
          statusCategories={statusCategories}
          setStatusCategories={setStatusCategories}
        />
      ))}
    </Box>
  );
}
