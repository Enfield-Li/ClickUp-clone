import {
  InputGroup,
  Input,
  InputRightElement,
  Flex,
  Box,
} from "@chakra-ui/react";
import produce from "immer";
import { useState } from "react";
import { SetState, UndeterminedColumn } from "../taskTypes";

type Props = {
  setState: SetState;
  currentColumn?: UndeterminedColumn;
  setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function EditColumnTitle({
  setState,
  currentColumn,
  setEditTitle,
}: Props) {
  const [titleInput, setTitleInput] = useState(currentColumn?.title);

  function finishEdit(e?: React.KeyboardEvent<HTMLInputElement>) {
    // Update column title
    setState((pre) => {
      if (pre) {
        return produce(pre, (draftState) => {
          draftState.columnOptions.status.forEach((column) =>
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
