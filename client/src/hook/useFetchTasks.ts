import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { fetchAllTasks as fetchTasksAndStatusCategory } from "../networkCalls";
import { ColumnOptions, SortBy, TaskState } from "../types";
import { sleep } from "../utils/sleep";
import { defaultColumnOptions } from "../utils/staticColumnsData";

interface UseFetchTasksParam {
  sortBy: SortBy;
  listId: number;
}
export function useFetchTasks({ sortBy, listId }: UseFetchTasksParam) {
  const location = useLocation();
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  //   console.log({ taskState });

  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  useEffect(() => {
    initTaskState();

    async function initTaskState() {
      if (!listId || !location?.state?.defaultStatusCategoryId) {
        setTaskState(undefined);
        setTaskStateContext(null);
        return;
      }

      // Task data
      const { defaultStatusCategoryId } = location.state;
      const networkData = await fetchTasksAndStatusCategory(
        listId,
        defaultStatusCategoryId
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

        const orderedTasks = groupTaskListOnSortBy(
          taskList,
          allColumns[`${sortBy}Columns`],
          sortBy
        );

        setTaskStateContext({
          columnOptions,
          setTaskState,
          sortBy,
          currentListId: listId,
        });
        setTaskState({ orderedTasks, columnOptions });

        setLoading(false);
      }
    }
  }, [listId, location]);

  // Sync up orderedTasks with columns under sortBy
  const statusColumnCount = taskState?.columnOptions.statusColumns.length;
  useEffect(() => {
    updateTaskState();

    async function updateTaskState() {
      if (!taskState || !taskStateContext) {
        return;
      }

      setLoading(true);

      if (taskState && taskStateContext) {
        setTaskStateContext({
          ...taskStateContext,
          sortBy,
        });

        setTaskState({
          ...taskState,
          orderedTasks: groupTaskListOnSortBy(
            collectAllTasks(taskState.orderedTasks),
            taskState.columnOptions[`${sortBy}Columns`],
            sortBy
          ),
        });

        await sleep(10);
      }

      setLoading(false);
    }
  }, [sortBy, statusColumnCount]); // Change of sortBy and adding status column

  // sync up with modal task
  useEffect(() => {
    if (task && taskState) {
      const allTasks = collectAllTasks(taskState.orderedTasks);
      const updatedTask = allTasks.find(
        (currentTask) => currentTask.id === task.id
      );
      if (updatedTask) setTask(updatedTask);
    }
  }, [taskState]);

  return { taskState, setTaskState, loading, error };
}
