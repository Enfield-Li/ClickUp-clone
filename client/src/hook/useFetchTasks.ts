import { useEffect, useState } from "react";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  collectAllTasks,
  groupTaskListOnGroupBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { useTaskDetail } from "../context/task_detail/useTaskDetail";
import { fetchAllTasks as fetchTasksAndStatusCategory } from "../networkCalls";
import { ColumnOptions, GroupBy, TaskState } from "../types";
import { sleep } from "../utils/sleep";
import { defaultColumnOptions } from "../utils/staticColumnsData";

interface UseFetchTasksParam {
  groupBy: GroupBy;
  listId: number;
  statusCategoryId: number | undefined;
}
export function useColumnTaskState({
  groupBy,
  listId,
  statusCategoryId,
}: UseFetchTasksParam) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taskState, setTaskState] = useState<TaskState>();
  //   console.log({ taskState });

  const { task, selectTask, taskStateContext, initTaskStateContext } =
    useTaskDetail();

  useEffect(() => {
    initTaskState();

    async function initTaskState() {
      if (!listId || !statusCategoryId) {
        setTaskState(undefined);
        initTaskStateContext(null);
        return;
      }

      // Task data
      const networkData = await fetchTasksAndStatusCategory(
        listId,
        statusCategoryId
      );

      if (networkData) {
        const {
          taskList: taskListData,
          statusCategory: { statusColumns },
        } = networkData;
        const { dueDateColumns, priorityColumns } = defaultColumnOptions;

        const allColumns: ColumnOptions = {
          dueDateColumns,
          priorityColumns,
          statusColumns,
        };

        const { reorderedDueDateColumns, reorderedStatusColumns } =
          initColumns(allColumns);

        const columnOptions: ColumnOptions = {
          ...allColumns,
          dueDateColumns: reorderedDueDateColumns,
          statusColumns: reorderedStatusColumns,
        };

        // init taskEvents and convert expectedDueDate to dueDate columns
        const taskList = processTaskList(reorderedDueDateColumns, taskListData);

        const orderedTasks = groupTaskListOnGroupBy(
          taskList,
          allColumns[`${groupBy}Columns`],
          groupBy
        );

        initTaskStateContext({
          columnOptions,
          setTaskState,
          groupBy: groupBy,
          currentListId: listId,
        });
        setTaskState({ orderedTasks, columnOptions, statusCategoryId });

        setLoading(false);
      }
    }
  }, [listId, statusCategoryId]);

  // Sync up orderedTasks with columns under groupBy
  const statusColumnCount = taskState?.columnOptions.statusColumns.length;
  useEffect(() => {
    updateTaskState();

    async function updateTaskState() {
      if (!taskState || !taskStateContext) {
        return;
      }

      setLoading(true);

      if (taskState && taskStateContext) {
        initTaskStateContext({
          ...taskStateContext,
          groupBy: groupBy,
        });

        setTaskState({
          ...taskState,
          orderedTasks: groupTaskListOnGroupBy(
            collectAllTasks(taskState.orderedTasks),
            taskState.columnOptions[`${groupBy}Columns`],
            groupBy
          ),
        });

        await sleep(10);
      }

      setLoading(false);
    }
  }, [groupBy, statusColumnCount]); // Change of groupBy and adding status column

  // sync up with modal task
  useEffect(() => {
    if (task && taskState) {
      const allTasks = collectAllTasks(taskState.orderedTasks);
      const updatedTask = allTasks.find(
        (currentTask) => currentTask.id === task.id
      );
      if (updatedTask) selectTask(updatedTask);
    }
  }, [taskState]);

  return { taskState, setTaskState, loading, error };
}
