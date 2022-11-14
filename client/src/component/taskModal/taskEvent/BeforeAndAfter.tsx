import { Box, Flex } from "@chakra-ui/react";
import { memo } from "react";
import useTaskDetailContext from "../../../context/task_detail/useTaskDetailContext";
import {
  BeforeOrAfterUpdate,
  ColumnOptions,
  DUE_DATE,
  Field,
  PRIORITY,
  SortBy,
  STATUS,
  UndeterminedColumns,
  UpdateEvent,
} from "../../../types";

type Props = {
  updateEvent: UpdateEvent;
  beforeOrAfterUpdate: keyof BeforeOrAfterUpdate;
};
function BeforeAndAfter({ updateEvent, beforeOrAfterUpdate }: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  let icon: JSX.Element;
  let element: JSX.Element;

  function isStatusField(field: Field): field is SortBy {
    return field === DUE_DATE || field === STATUS || field === PRIORITY;
  }

  function getColumn(
    columnOptions: ColumnOptions,
    updateEvent: UpdateEvent,
    columnId: string
  ) {
    const field = updateEvent.field;
    if (isStatusField(field)) {
      const field = updateEvent.field as SortBy;
      return (columnOptions[field] as UndeterminedColumns).find(
        (column) => column.id === Number(columnId)
      );
    }
  }

  if (isStatusField(updateEvent.field) && updateEvent[beforeOrAfterUpdate]) {
    const column = getColumn(
      columnOptions,
      updateEvent,
      updateEvent[beforeOrAfterUpdate]!
    );

    // status square icon
    if (updateEvent.field === STATUS) {
      icon = (
        <Box
          width="10px"
          height="10px"
          rounded="sm"
          backgroundColor={column?.color}
        ></Box>
      );
    }
    // priority flag icon
    else if (updateEvent.field === PRIORITY) {
      icon = (
        <Box color={column?.color}>
          <i className="bi bi-flag-fill"></i>
        </Box>
      );
    }
    // dueDate clock icon
    else {
      icon = (
        <Box color={column?.color}>
          <i className="bi bi-alarm-fill"></i>
        </Box>
      );
    }

    // Return element
    element = (
      <Flex alignItems="center">
        {icon}
        <span>&nbsp;</span>
        {column?.title}
      </Flex>
    );
  } else {
    element = <Box>{updateEvent[beforeOrAfterUpdate]}</Box>;
  }

  return element;
}
export default memo(BeforeAndAfter);
