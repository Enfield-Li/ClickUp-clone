import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import { StatusColumnCategory } from "../../types";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  statusColumn: StatusColumnCategory;
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default function StatusItemTitle({
  statusColumn,
  statusCategories,
  setStatusCategories,
}: Props) {
  const [hover, setHover] = useState(false);
  const fontColor = useColorModeValue("black", "lightMain.200");
  const color =
    statusCategories?.selectedCategoryName === statusColumn.statusCategoryName
      ? "purple.500"
      : fontColor;

  return (
    <Flex
      my="2"
      cursor="pointer"
      justifyContent="space-between"
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
      onClick={() => {
        setStatusCategories(
          produce(statusCategories, (draftState) => {
            draftState.selectedCategoryName = statusColumn.statusCategoryName;
          })
        );
      }}
    >
      <Box color={color} fontWeight="semibold">
        {statusColumn.statusCategoryName}
      </Box>

      {hover && statusColumn.statusCategoryName !== "Custom" && (
        <Flex opacity="60%">
          {/* Edit */}
          <Center fontSize="10px" mr="3" _hover={{ color: "purple.500" }}>
            <i className="bi bi-pencil-fill"></i>
          </Center>

          {/* Close */}
          <Center fontSize="10px" _hover={{ color: "purple.500" }}>
            <CloseIcon />
          </Center>
        </Flex>
      )}
    </Flex>
  );
}
