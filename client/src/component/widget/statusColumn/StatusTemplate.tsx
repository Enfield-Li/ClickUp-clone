import { Box, Center, Flex } from "@chakra-ui/react";
import React, { memo } from "react";
import { StatusCategoryState } from "../../../types";
import AddStatusCategory from "./AddStatusCategory";
import StatusCategoryItem from "./StatusCategoryItem";

type Props = {
  statusCategoryState: StatusCategoryState;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(StatusTemplate);
function StatusTemplate({
  statusCategoryState,
  setStatusCategoryState,
}: Props) {
  return (
    <Box height="80%">
      <Box ml="3" maxHeight="235px" overflow="auto">
        <Flex alignItems="center">
          <Box
            opacity="50%"
            fontSize="12px"
            letterSpacing="wide"
            fontWeight="semibold"
          >
            TEMPLATE
          </Box>

          <Center
            ml="2px"
            color="gray"
            width="12px"
            height="12px"
            fontSize="10px"
            fontWeight="semibold"
          >
            ({statusCategoryState.categories.length})
          </Center>
        </Flex>

        {statusCategoryState.categories.map((currentCategory, index) => (
          <Box key={currentCategory.id}>
            <StatusCategoryItem
              currentCategory={currentCategory}
              statusCategoriesSelected={statusCategoryState}
              setStatusCategoryState={setStatusCategoryState}
            />
          </Box>
        ))}
      </Box>

      <AddStatusCategory
        statusCategoryState={statusCategoryState}
        setStatusCategoryState={setStatusCategoryState}
      />

      {statusCategoryState.errorMsg && (
        <Flex mt="2" fontSize="12px" color="red.500">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <Box ml="2">{statusCategoryState.errorMsg}</Box>
        </Flex>
      )}
    </Box>
  );
}
