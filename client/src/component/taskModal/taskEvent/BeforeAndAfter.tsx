import { Box, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useTaskDetail } from "../../../context/task_detail/useTaskDetail";
import {
  BeforeOrAfterUpdate,
  ColumnOptions,
  Field,
  GroupBy,
  UndeterminedColumns,
  UpdateEvent,
} from "../../../types";

type Props = {
  updateEvent: UpdateEvent;
  beforeOrAfterUpdate: keyof BeforeOrAfterUpdate;
};

export default memo(BeforeAndAfter);
function BeforeAndAfter({ updateEvent, beforeOrAfterUpdate }: Props) {
  const { taskStateContext } = useTaskDetail();
  const { columnOptions } = taskStateContext!;

  let icon: JSX.Element;
  let element: JSX.Element;

  function isStatusField(field: Field): field is GroupBy {
    return (
      field === GroupBy.DUE_DATE ||
      field === GroupBy.STATUS ||
      field === GroupBy.PRIORITY
    );
  }

  function getColumn(
    columnOptions: ColumnOptions,
    updateEvent: UpdateEvent,
    columnId: string
  ) {
    const field = updateEvent.field;
    if (isStatusField(field)) {
      const field = updateEvent.field as GroupBy;
      return (columnOptions[`${field}Columns`] as UndeterminedColumns).find(
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
    if (updateEvent.field === GroupBy.STATUS) {
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
    else if (updateEvent.field === GroupBy.PRIORITY) {
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
