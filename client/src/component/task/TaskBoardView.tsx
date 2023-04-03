import { Box, Center, Flex, Spinner } from "@chakra-ui/react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import produce from "immer";
import { memo, useCallback, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTaskDetail } from "../../context/task_detail/useTaskDetail";
import { useColumnTaskState } from "../../hook/useFetchTasks";
import { updateTasksPosition } from "../../networkCalls";
import {
  LookUpReorderedColumn,
  SetTaskState,
  GroupBy,
  TaskPositionDTOList,
  TaskState,
  UndeterminedColumns,
  UpdateTasksPositionDTO,
} from "../../types";
import { newEventDTO } from "../../utils/createNewEvent";
import { deepCopy } from "../../utils/deepCopy";
import { isDueDateColumns } from "../../utils/determineColumns";
import { newTaskPositionDTO } from "../../utils/newTaskPositionDTO";
import {
  getExpectedDueDateFromDueDateColumn,
  getLookUpReorderedColumnTable,
} from "./actions/taskProcessing";
import Column from "./Column";
import AddStatusColumn from "./customStatusColumn/AddStatusColumn";
import CreateListPanel from "./panel/CreateListPanel";
import CreateSpacePanel from "./panel/CreateSpacePanel";

type Props = {
  groupBy: GroupBy;
};

export default memo(TaskBoardView);
function TaskBoardView({ groupBy }: Props) {
  const location = useLocation();
  const { listId, spaceId } = useParams();
  const statusCategoryId = location?.state?.defaultStatusCategoryId as
    | number
    | undefined;
  useColumnTaskState({
    groupBy,
    statusCategoryId,
    listId: Number(listId),
  });
  const { loading, taskState, dragTask } = useTaskDetail();
  //   console.log({ taskState });

  const memHandleDragEnd = useCallback(
    (result: DropResult, taskState: TaskState) => {
      dragTask({ result, groupBy });
    },
    [groupBy]
  );

  if (!spaceId) {
    return (
      <Center height="50vh">
        <CreateSpacePanel />
      </Center>
    );
  }

  if (!listId) {
    return (
      <Center flexGrow={1} mt="-60px">
        <CreateListPanel />
      </Center>
    );
  }

  if (loading || !taskState) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const selectedColumns = taskState.columnOptions[`${groupBy}Columns`];

  return (
    <Box px={6} overflowY="auto" mr={3} pt="3">
      <DragDropContext
        onDragEnd={(result) => memHandleDragEnd(result, taskState)}
      >
        <Flex>
          {/* Columns and tasks */}
          {selectedColumns.map((currentColumn, index) => {
            const taskListForCurrentColumn = taskState.orderedTasks.find(
              (orderedTask) => orderedTask.columnId === currentColumn.id
            )?.taskList;

            return (
              <Box key={currentColumn.id} borderRadius={4}>
                <Column
                  taskState={taskState}
                  currentColumn={currentColumn}
                  // Pass down list as per column.id
                  taskList={taskListForCurrentColumn}
                />
              </Box>
            );
          })}

          {/* Add column in status */}
          {groupBy === GroupBy.STATUS && (
            <Box mx={2}>
              <AddStatusColumn
                statusCategoryId={statusCategoryId}
                statusColumns={taskState.columnOptions.statusColumns}
              />
            </Box>
          )}
        </Flex>
      </DragDropContext>
    </Box>
  );
}
