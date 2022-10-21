import { Box, Flex } from "@chakra-ui/react";
import useAuthContext from "../../../../context/auth/useAuthContext";
import useTaskDetailContext from "../../../../context/task_detail/useTaskDetailContext";
import { ColumnOptions, Columns, Field, SortBy, UpdateEvent } from "../../Data";

type Props = { updateEvent: UpdateEvent };

export default function UpdateEvents({ updateEvent }: Props) {
  const { authState } = useAuthContext();
  const { taskStateContext } = useTaskDetailContext();
  const { columnOptions } = taskStateContext!;

  //   let before: JSX.Element;
  //   let after: JSX.Element;

  //   if (
  //     isStatusField(updateEvent.field) &&
  //     updateEvent.before &&
  //     updateEvent.after
  //   ) {
  //     const beforeColumn = getColumn(
  //       columnOptions,
  //       updateEvent,
  //       updateEvent.before
  //     );
  //     const afterColumn = getColumn(
  //       columnOptions,
  //       updateEvent,
  //       updateEvent.after
  //     );

  //     before = (
  //       <Box color={beforeColumn?.color} mr={4}>
  //         <i className="bi bi-flag-fill"></i>
  //         &nbsp;{beforeColumn?.title}
  //       </Box>
  //     );
  //     after = (
  //       <Box color={afterColumn?.color} mr={4}>
  //         <i className="bi bi-flag-fill"></i>
  //         &nbsp;{afterColumn?.title}
  //       </Box>
  //     );
  //   } else {
  //     before = <Box>{updateEvent.before}</Box>;
  //     after = <Box>{updateEvent.after}</Box>;
  //   }

  return (
    <Flex>
      {/* Someone */}
      {authState.user!.id === updateEvent.userId
        ? "You"
        : updateEvent.username[0]}

      {/* changed something from */}
      <Box opacity="60%">&nbsp;changed {updateEvent.field} from&nbsp;</Box>

      {/* Before */}
      {updateEvent.before ? (
        <>{getJSX(columnOptions, updateEvent, "before")}</>
      ) : (
        "none"
      )}

      {/* to */}
      <Box opacity="60%">&nbsp;to&nbsp;</Box>

      {/* After */}
      <>{getJSX(columnOptions, updateEvent, "after")}</>
    </Flex>
  );
}

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

function getJSX(
  columnOptions: ColumnOptions,
  updateEvent: UpdateEvent,
  beforeOrAfter: "before" | "after"
) {
  let element: JSX.Element;

  if (isStatusField(updateEvent.field) && updateEvent[beforeOrAfter]) {
    const column = getColumn(
      columnOptions,
      updateEvent,
      updateEvent[beforeOrAfter]!
    );

    element = (
      <Box color={column?.color}>
        <i className="bi bi-flag-fill"></i>
        &nbsp;{column?.title}
      </Box>
    );
  } else {
    element = <Box>{updateEvent[beforeOrAfter]}</Box>;
  }

  return element;
}
