import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import React, { useState } from "react";
import { getRandomNumber } from "../../../utils/getRandomNumber";
import { StatusColumns, SetState, StatusColumn } from "../taskTypes";

type Props = {
  setState: SetState;
  statusColumns: StatusColumns;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddStatusColumnInput({
  setState,
  setShowEdit,
  statusColumns,
}: Props) {
  const [titleInput, setTitleInput] = useState("");

  function createStatusColumn() {
    const previousColumnId = statusColumns[statusColumns.length - 1].id;

    const newColumn: StatusColumn = {
      id: 4,
      color: "",
      title: titleInput,
      previousColumnId,
    };

    setState((pre) => {
      if (pre) {
        return produce(pre, (draftState) => {
          draftState.columnOptions.status.push(newColumn);
        });
      }
    });
  }

  return (
    <InputGroup>
      {/* Input */}
      <Input
        autoFocus
        size="xs"
        width="200px"
        height="48px"
        boxShadow="base"
        minWidth="280px"
        cursor="pointer"
        borderTopRadius="sm"
        value={titleInput}
        onChange={(e) => {
          setTitleInput(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createStatusColumn();
            setShowEdit(false);
          } else if (e.key === "Escape") {
            setShowEdit(false);
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
              fontSize="40px"
              color="green.500"
              onClick={() => {
                createStatusColumn();
              }}
            >
              <i className="bi bi-check"></i>
            </Box>

            {/* Cancel */}
            <Box
              mr={2}
              fontSize="40px"
              color="red.500"
              onClick={() => {
                // Do nothing and close edit
                setShowEdit(false);
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
