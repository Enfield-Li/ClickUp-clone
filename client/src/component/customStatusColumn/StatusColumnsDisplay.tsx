import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { defaultStatusColumnCategories } from "../../hook/defaultStatuses";
import { StatusColumnCategories } from "../../types";
import ActiveStatuses from "./ActiveStatuses";
import StatusTemplate from "./StatusTemplate";

type Props = {};

export interface StatusCategories {
  selectedCategoryName: string;
  statusColumnCategories: StatusColumnCategories;
}

export default function StatusColumnsDisplay({}: Props) {
  const [statusCategories, setStatusCategories] = useState<StatusCategories>({
    selectedCategoryName: "Custom",
    statusColumnCategories: defaultStatusColumnCategories,
  });
  const selectedCategory = statusCategories.statusColumnCategories.find(
    (category) =>
      category.statusCategoryName === statusCategories.selectedCategoryName
  );

  useEffect(() => {
    setStatusCategories({
      selectedCategoryName: "Custom",
      statusColumnCategories: defaultStatusColumnCategories,
    });
  }, []);

  return (
    <>
      <Box height="100%" width="50%" pr="4">
        <Box
          opacity="50%"
          fontSize="12px"
          letterSpacing="wide"
          fontWeight="semibold"
        >
          TEMPLATE
        </Box>

        <StatusTemplate
          statusCategories={statusCategories}
          setStatusCategories={setStatusCategories}
        />
      </Box>

      <Box height="100%" width="50%">
        <Box
          opacity="50%"
          fontSize="12px"
          letterSpacing="wide"
          fontWeight="semibold"
        >
          ACTIVE STATUSES
        </Box>

        <ActiveStatuses
          selectedCategory={selectedCategory}
          setStatusCategories={setStatusCategories}
        />
      </Box>
    </>
  );
}
