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
import { useCurrentListStore } from "../../../context/currentListStore/useCurrentListStore";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
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
  statusColumns: StatusColumns;
  onColorPalletClose: () => void;
};

export default memo(AddStatusColumnInput);
function AddStatusColumnInput({
  color,
  statusColumns,
  statusCategoryId,
  onColorPalletClose,
}: Props) {
  const { listId } = useParams();
  const [title, setTitle] = useState("");
  const { addColumn } = useTaskDetail();
  const { storedDefaultCategoryId, updateStoredDefaultCategoryId } =
    useCurrentListStore();
  const isTitleTaken = statusColumns.some((column) => column.title === title);

  function handleAddStatusColumn() {
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
      addColumn({
        dto,
        responseDTO,
        lastItemIndex,
        storedDefaultCategoryId,
        updateStoredDefaultCategoryId,
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
              handleAddStatusColumn();
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
                onClick={!isTitleTaken ? handleAddStatusColumn : undefined}
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
