import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCurrentListStore } from "../../../context/newDefaultColumnIdStore/useCurrentListStore";
import { addStatusColumn } from "../../../networkCalls";
import {
  AddStatusColumnDTO,
  SetTaskState,
  StatusColumns,
} from "../../../types";
import { deepCopy } from "../../../utils/deepCopy";

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
  const { storedDefaultCategoryId, updateStoredDefaultCategoryId } =
    useCurrentListStore();
  const isTitleTaken = statusColumns.some((column) => column.title === title);

  function createStatusColumn() {
    if (!statusCategoryId) {
      throw new Error("statusCategoryId is not initialized");
    }
    if (!listId || !Number(listId)) {
      throw new Error("listId is not initialized");
    }

    const isStoredDefaultCategoryIdUpdated =
      storedDefaultCategoryId && storedDefaultCategoryId !== statusCategoryId;
    if (isStoredDefaultCategoryIdUpdated) {
      statusCategoryId = storedDefaultCategoryId;
    }

    const lastItemIndex = statusColumns.length - 1;
    const indexBeforeTheEnd = statusColumns.length - 2;
    const orderIndex = statusColumns[indexBeforeTheEnd].orderIndex + 1;

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
            const {
              statusColumnId: newStatusColumnId,
              statusCategoryId: updatedStatusCategoryId,
              oldNewStatusPairs,
            } = responseDTO;

            const newStatusColumn = { ...dto, id: newStatusColumnId };
            draftState.statusCategoryId = updatedStatusCategoryId;
            // Create new column before the last one "Done"
            draftState.columnOptions.statusColumns.splice(
              lastItemIndex,
              0,
              newStatusColumn
            );

            if (storedDefaultCategoryId !== updatedStatusCategoryId) {
              updateStoredDefaultCategoryId(updatedStatusCategoryId);
            }
            if (oldNewStatusPairs) {
              draftState.columnOptions.statusColumns.forEach((column) => {
                if (oldNewStatusPairs[column.id!]) {
                  column.id = oldNewStatusPairs[column.id!];
                }
              });
              draftState.orderedTasks.forEach((orderedTask) => {
                orderedTask.columnId = oldNewStatusPairs[orderedTask.columnId];
                orderedTask.taskList.forEach((task) => {
                  task.status.columnId =
                    oldNewStatusPairs[task.status.columnId];
                });
              });
            }
          });
        }
      });
    });
  }

  return (
    <>
      <InputGroup>
        {/* Input */}
        <Input
          _hover={{}}
          _focusVisible={{}}
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
            if (e.key === "Enter" && !isTitleTaken) {
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
                onClick={!isTitleTaken ? createStatusColumn : undefined}
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

      {isTitleTaken && (
        <Box fontSize="small" mt="1" color="red.400">
          Title already exists
        </Box>
      )}
    </>
  );
}
