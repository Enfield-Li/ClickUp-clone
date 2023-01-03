import {
  Box,
  Center,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo } from "react";
import { StatusCategory, StatusCategoryState } from "../../../types";
import ActiveStatus from "./ActiveStatus";
import AddStatus from "./AddStatus";

type Props = {
  selectedCategory?: StatusCategory;
  setStatusCategoryState: React.Dispatch<
    React.SetStateAction<StatusCategoryState>
  >;
};

export default memo(ActiveStatuses);
function ActiveStatuses({ selectedCategory, setStatusCategoryState }: Props) {
  const questionMarkColor = useColorModeValue("white", "darkMain.200");

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
                    selectedCategory={selectedCategory}
                    currentStatusColumn={currentStatusColumn}
                    setStatusCategoryState={setStatusCategoryState}
                  />
                </Box>
              )
          )}
        </Box>

        <AddStatus
          selectedCategory={selectedCategory}
          setStatusCategoryState={setStatusCategoryState}
          statusCategoriesAmount={selectedCategory?.statusColumns.length}
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
            selectedCategory={selectedCategory}
            currentStatusColumn={finishedStatus}
            setStatusCategoryState={setStatusCategoryState}
          />
        )}
      </Box>
    </Box>
  );
}
