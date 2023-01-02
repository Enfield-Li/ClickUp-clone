import { Box, Center, Flex, Input } from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { StatusColumn } from "../../../types";
import { StatusCategoriesSelected } from "./StatusColumnsDisplay";

type Props = {
  currentStatusColumn: StatusColumn;
  selectedCategoryName: string | undefined;
  setStatusCategories: React.Dispatch<
    React.SetStateAction<StatusCategoriesSelected>
  >;
};

export default memo(ActiveStatus);
function ActiveStatus({
  currentStatusColumn,
  selectedCategoryName,
  setStatusCategories,
}: Props) {
  const [title, setTitle] = useState("");
  const [hover, setHover] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(currentStatusColumn.title);
  }, [currentStatusColumn]);

  function handleFinishedEdit() {
    setEditing(false);
    updateStatusTitle();
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void {
    e.stopPropagation();
    if (e.key === "Enter" && title) {
      handleFinishedEdit();
    } else if (e.key === "Escape") {
      setEditing(false);
      setTitle(currentStatusColumn.title);
    }
  }

  function updateStatusTitle() {
    setStatusCategories((prev) =>
      produce(prev, (draftState) => {
        draftState.statusCategories.forEach((category) => {
          if (category.name === selectedCategoryName) {
            category.statusColumns.forEach((column) => {
              if (column.id === currentStatusColumn.id) {
                column.title = title;
              }
            });
          }
        });
      })
    );
  }

  function handleEdit(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
  }

  return (
    <Flex
      px="2"
      my="8px"
      rounded="md"
      height="25px"
      fontSize="13px"
      cursor="pointer"
      borderWidth="1px"
      fontWeight="semibold"
      borderColor="blackAlpha.500"
      justifyContent="space-between"
      onClick={() => setEditing(true)}
      onMouseLeave={() => setHover(false)}
      onMouseOverCapture={() => setHover(true)}
    >
      <Flex alignItems="center">
        {/* Square */}
        <Box
          mr="6px"
          width="10px"
          rounded="sm"
          height="10px"
          bgColor={currentStatusColumn.color}
        ></Box>

        {/* Title */}
        {editing ? (
          <Box>
            <Input
              autoFocus
              color="gray"
              height="20px"
              value={title}
              fontSize="13px"
              variant="unstyled"
              textTransform="uppercase"
              onKeyDown={handleKeyPress}
              onBlur={handleFinishedEdit}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        ) : (
          <Box color={currentStatusColumn.color}>
            {currentStatusColumn.title.replaceAll("_", " ").toUpperCase()}
          </Box>
        )}

        {/* Edit */}
        {hover && !editing && (
          <Box ml="2" opacity="60%" fontSize="10px">
            <i className="bi bi-pencil-fill"></i>
          </Box>
        )}
      </Flex>

      {/* Options */}
      <Center _hover={{ color: "purple.500" }} onClick={handleEdit}>
        <i className="bi bi-three-dots"></i>
      </Center>
    </Flex>
  );
}
