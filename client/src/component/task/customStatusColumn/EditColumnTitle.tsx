import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import { UndeterminedColumn } from "../../../types";

type Props = {
  currentColumn?: UndeterminedColumn;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(EditColumnTitle);
function EditColumnTitle({ currentColumn, setEditTitle }: Props) {
  const [titleInput, setTitleInput] = useState(currentColumn?.title);

  const { taskStateContext } = useTaskDetail();
  const { setTaskState } = taskStateContext!;

  function finishEdit(e?: React.KeyboardEvent<HTMLInputElement>) {
    // Update column title
    setTaskState((pre) => {
      if (pre) {
        return produce(pre, (draftState) => {
          draftState.columnOptions.statusColumns.forEach((column) =>
            column.id === currentColumn?.id &&
            e?.currentTarget.value !== column.title
              ? titleInput && (column.title = titleInput)
              : column
          );
        });
      }
    });
    // Close edit
    setEditTitle(false);
  }

  return (
    <InputGroup width="200px" size="xs">
      {/* Input */}
      <Input
        autoFocus
        value={titleInput}
        onChange={(e) => {
          setTitleInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            finishEdit(e);
          } else if (e.key === "Escape") {
            setEditTitle(false);
          }
        }}
      />

      <InputRightElement
        mr={4}
        cursor="pointer"
        children={
          <Flex justifyContent="center" alignItems="center">
            {/* Accept change */}
            <Box
              mr={1}
              fontSize="20px"
              color="green.500"
              onClick={() => {
                finishEdit();
              }}
            >
              <i className="bi bi-check"></i>
            </Box>

            {/* Cancel */}
            <Box
              mr={2}
              fontSize="20px"
              color="red.500"
              onClick={() => {
                // Do nothing and close edit
                setEditTitle(false);
              }}
            >
              <i className="bi bi-x"></i>
            </Box>
          </Flex>
        }
      />
    </InputGroup>
  );
}
