import { Box, Flex } from "@chakra-ui/react";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { ColumnOptions, Columns, Field, SortBy, UpdateEvent } from "../../Data";

type Props = {
  updateEvent: UpdateEvent;
  beforeOrAfter: "before" | "after";
};

export default function BeforeAndAfter({ updateEvent, beforeOrAfter }: Props) {
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  let icon: JSX.Element;
  let element: JSX.Element;

  function isStatusField(field: Field): field is SortBy {
    return field === "dueDate" || field === "status" || field === "priority";
  }

  function getColumn(
    columnOptions: ColumnOptions,
    updateEvent: UpdateEvent,
    columnId: string
  ) {
    const field = updateEvent.field;
    if (isStatusField(field)) {
      const field = updateEvent.field as SortBy;
      return (columnOptions[field] as Columns).find(
        (column) => column.id === Number(columnId)
      );
    }
  }

  if (isStatusField(updateEvent.field) && updateEvent[beforeOrAfter]) {
    const column = getColumn(
      columnOptions,
      updateEvent,
      updateEvent[beforeOrAfter]!
    );

    // status square icon
    if (updateEvent.field === "status") {
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
    else if (updateEvent.field === "priority") {
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

    element = (
      <Flex alignItems="center">
        {icon}
        &nbsp;{column?.title}
      </Flex>
    );
  } else {
    element = <Box>{updateEvent[beforeOrAfter]}</Box>;
  }

  return element;
}
