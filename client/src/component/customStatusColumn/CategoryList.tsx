import { CloseIcon } from "@chakra-ui/icons";
import { Box, Center, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import { StatusColumnCategory } from "../../types";
import { StatusCategories } from "./StatusColumnsDisplay";

type Props = {
  statusColumn: StatusColumnCategory;
  statusCategories: StatusCategories;
  setStatusCategories: React.Dispatch<React.SetStateAction<StatusCategories>>;
};

export default function CategoryList({
  statusColumn,
  statusCategories,
  setStatusCategories,
}: Props) {
  const [hover, setHover] = useState(false);
  const fontColor = useColorModeValue("black", "lightMain.200");
  const [editing, setEditing] = useState(false);

  const color =
    statusCategories?.selectedCategoryName === statusColumn.statusCategoryName
      ? "purple.500"
      : fontColor;

  function handleEditTitle(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setStatusCategories(produce(statusCategories, (draftState) => {}));
  }

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
      <Input value={statusColumn.statusCategoryName} onChange={() => {}} />
      {/* <Box color={color} fontWeight="semibold">
        {statusColumn.statusCategoryName}
      </Box> */}

      {hover && statusColumn.statusCategoryName !== "Custom" && (
        <Flex opacity="60%">
          {/* Edit */}
          <Center
            mr="3"
            fontSize="10px"
            onClick={handleEditTitle}
            _hover={{ color: "purple.500" }}
          >
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
