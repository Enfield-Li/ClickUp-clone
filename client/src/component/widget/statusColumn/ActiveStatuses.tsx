import {
  Box,
  Button,
  Center,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import { TeamStatusColumn } from "../../../types";
import ActiveStatus from "./ActiveStatus";
import AddStatus from "./AddStatus";
import { StatusCategoriesSelected } from "./StatusColumnsDisplay";

type Props = {
  selectedCategory: TeamStatusColumn | undefined;
  setStatusCategories: React.Dispatch<
    React.SetStateAction<StatusCategoriesSelected>
  >;
};

export default memo(ActiveStatuses);
function ActiveStatuses({ selectedCategory, setStatusCategories }: Props) {
  const questionMarkColor = useColorModeValue("white", "darkMain.200");
  const selectedCategoryName = selectedCategory?.name;
  const finishedStatus = selectedCategory?.statusColumns.find(
    (statusColumn) => statusColumn.markAsClosed
  );

  return (
    <Box>
      <Flex alignItems="center">
        <Box
          opacity="50%"
          fontSize="12px"
          letterSpacing="wide"
          fontWeight="semibold"
        >
          ACTIVE STATUSES
        </Box>

        <Tooltip
          py="1"
          px="3"
          rounded="md"
          fontSize="11px"
          placement="top"
          label={
            <Box fontWeight="semibold" pb="1">
              <Center>Active statuses are for tasks have not</Center>
              <Center>been completed yet.</Center>
            </Box>
          }
        >
          <Center
            ml="1"
            width="12px"
            height="12px"
            rounded="full"
            fontSize="10px"
            cursor="pointer"
            fontWeight="extrabold"
            bgColor="lightMain.400"
            border="blackAlpha.300"
            color={questionMarkColor}
          >
            ?
          </Center>
        </Tooltip>
      </Flex>

      <Box height="205px">
        <Box maxHeight="170px" overflow="auto">
          {selectedCategory?.statusColumns.map(
            (currentStatusColumn) =>
              !currentStatusColumn.markAsClosed && (
                <Box key={currentStatusColumn.id}>
                  <ActiveStatus
                    currentStatusColumn={currentStatusColumn}
                    setStatusCategories={setStatusCategories}
                    selectedCategoryName={selectedCategoryName}
                  />
                </Box>
              )
          )}
        </Box>

        <AddStatus
          setStatusCategories={setStatusCategories}
          selectedCategoryName={selectedCategoryName}
          statusAmount={selectedCategory?.statusColumns.length}
        />
      </Box>

      <Box height="89.5px">
        <Flex alignItems="center">
          <Box
            opacity="50%"
            fontSize="12px"
            letterSpacing="wide"
            fontWeight="semibold"
          >
            FINISHED STATUS
          </Box>

          <Tooltip
            py="1"
            px="3"
            rounded="md"
            fontSize="11px"
            placement="top"
            label={
              <Box fontWeight="semibold" pb="1">
                <Center>This is the last stage of tasks.</Center>
                <Center>Finished tasks are hidden</Center>
                <Center>from view by default.</Center>
              </Box>
            }
          >
            <Center
              ml="1"
              width="12px"
              height="12px"
              rounded="full"
              fontSize="10px"
              fontWeight="extrabold"
              bgColor="lightMain.400"
              border="blackAlpha.300"
              color={questionMarkColor}
            >
              ?
            </Center>
          </Tooltip>
        </Flex>

        {finishedStatus && (
          <ActiveStatus
            currentStatusColumn={finishedStatus}
            setStatusCategories={setStatusCategories}
            selectedCategoryName={selectedCategoryName}
          />
        )}
      </Box>
    </Box>
  );
}
