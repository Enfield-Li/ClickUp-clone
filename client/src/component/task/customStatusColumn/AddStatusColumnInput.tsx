import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import { useParams } from "react-router-dom";
import { addStatusColumn } from "../../../networkCalls";
import {
  AddStatusColumnDTO,
  SetTaskState,
  StatusColumn,
  StatusColumns,
} from "../../../types";

type Props = {
  color: string;
  statusCategoryId?: number;
  setTaskState: SetTaskState;
  statusColumns: StatusColumns;
  onColorPalletClose: () => void;
};

export default memo(AddStatusColumnInput);
function AddStatusColumnInput({
  color,
  setTaskState,
  statusColumns,
  statusCategoryId,
  onColorPalletClose,
}: Props) {
  const { listId } = useParams();
  const [title, setTitle] = useState("");

  function createStatusColumn() {
    if (!statusCategoryId) {
      throw new Error("statusCategoryId is not initialized");
    }
    if (!listId || !Number(listId)) {
      throw new Error("listId is not initialized");
    }

    const lastItemIndex = statusColumns.length - 1;
    const indexBeforeTheEnd = statusColumns.length - 2;
    const orderIndex = statusColumns[indexBeforeTheEnd].orderIndex + 1;
    // TODO: orderIndex bug

    const dto: AddStatusColumnDTO = {
      color,
      title,
      orderIndex,
      statusCategoryId,
      listId: Number(listId),
    };

    addStatusColumn(dto, (responseDTO) => {
      setTaskState((pre) => {
        if (pre) {
          return produce(pre, (draftState) => {
            const { statusColumnId, statusCategoryId } = responseDTO;

            draftState.statusCategoryId = statusCategoryId;

            // Create new column before the last one "Done"
            const newColumn: StatusColumn = { id: statusColumnId, ...dto };
            draftState.columnOptions.statusColumns.splice(
              lastItemIndex,
              0,
              newColumn
            );
          });
        }
      });
    });
  }

  return (
    <InputGroup>
      {/* Input */}
      <Input
        autoFocus
        size="xs"
        value={title}
        width="200px"
        height="48px"
        borderTop="2px"
        boxShadow="base"
        minWidth="250px"
        cursor="pointer"
        borderTopRadius="sm"
        borderTopColor={color}
        textTransform="uppercase"
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            createStatusColumn();
            onColorPalletClose();
          } else if (e.key === "Escape") {
            onColorPalletClose();
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
                onColorPalletClose();
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
