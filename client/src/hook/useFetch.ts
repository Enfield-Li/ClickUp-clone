import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initColumns } from "../component/task/actions/columnProcessing";
import { fetchAllTasks } from "../component/task/actions/networkActions";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import {
  ColumnOptions,
  SortBy,
  StatusColumns,
  TaskList,
  TaskState,
} from "../types";
import { sleep } from "../utils/sleep";
import { defaultColumnOptions } from "./mockData";

interface UseFetchTasksParam {
  sortBy: SortBy;
  selectedListId: number;
}
export function useFetchTasks({ sortBy, selectedListId }: UseFetchTasksParam) {
  const location = useLocation();
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  useEffect(() => {
    initTaskState();

    async function initTaskState() {
      if (!selectedListId && !location.state) {
        setTaskState(undefined);
        setTaskStateContext(null);
        return;
      }

      setLoading(true);

      // Task data
      const tasksData = await fetchAllTasks(selectedListId);

      if (tasksData) {
        const statusColumnFromRouter: StatusColumns =
          location.state.statusColumns;

        const allColumns: ColumnOptions = {
          dueDateColumns: defaultColumnOptions.dueDateColumns,
          priorityColumns: defaultColumnOptions.priorityColumns,
          statusColumns: statusColumnFromRouter,
        };

        const { reorderedDueDateColumns, reorderedStatusColumns } =
          initColumns(allColumns);

        const columnOptions: ColumnOptions = {
          ...allColumns,
          dueDateColumns: reorderedDueDateColumns,
          statusColumns: reorderedStatusColumns,
        };

        // init taskEvents and convert expectedDueDate to dueDate columns
        const taskList = processTaskList(reorderedDueDateColumns, tasksData);

        const orderedTasks = groupTaskListOnSortBy(
          taskList,
          allColumns[`${sortBy}Columns`],
          sortBy
        );

        setTaskStateContext({
          columnOptions,
          setTaskState,
          sortBy,
          currentListId: selectedListId,
        });
        setTaskState({ orderedTasks, columnOptions });

        setLoading(false);
      }
    }
  }, [selectedListId, location.state]);

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
