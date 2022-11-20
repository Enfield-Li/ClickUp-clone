import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import React, { memo, useState } from "react";
import { SetTaskState, StatusColumn, StatusColumns } from "../../../types";

type Props = {
  color: string;
  setTaskState: SetTaskState;
  statusColumns: StatusColumns;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

function AddStatusColumnInput({
  color,
  setTaskState,
  setShowEdit,
  statusColumns,
}: Props) {
  const [titleInput, setTitleInput] = useState("");

  function createStatusColumn() {
    const newColumn: StatusColumn = {
      id: 4,
      color,
      orderIndex: 3,
      title: titleInput,
    };

    setTaskState((pre) => {
      if (pre) {
        return produce(pre, (draftState) => {
          const indexBeforeTheEnd =
            draftState.columnOptions.statusColumns.length - 1;
          // Create new column before the last one "Done"
          draftState.columnOptions.statusColumns.splice(
            indexBeforeTheEnd,
            0,
            newColumn
          );
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
        borderTop="2px"
        boxShadow="base"
        minWidth="250px"
        cursor="pointer"
        value={titleInput}
        borderTopRadius="sm"
        borderTopColor={color}
        textTransform="uppercase"
        onChange={(e) => setTitleInput(e.target.value)}
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
        mt="3px"
        cursor="pointer"
        children={
          <Flex justifyContent="center" alignItems="center">
            {/* Accept change */}
            <Box
              fontSize="33px"
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
              fontSize="33px"
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
export default memo(AddStatusColumnInput);
