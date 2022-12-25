import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { ColumnOptions, SortBy, StatusColumns, TaskState } from "../types";
import { sleep } from "../utils/sleep";
import { fetchLocalTaskList } from "./fetchLocalTaskList";
import { defaultColumnOptions } from "./mockData";

interface UseLocalTasksParam {
  sortBy: SortBy;
  selectedListId: number;
}
export function useLocalTasks({ sortBy, selectedListId }: UseLocalTasksParam) {
  const location = useLocation();
  //   console.log({ selectedListId, locationState: location.state });

  const [loading, setLoading] = useState(true);
  const [taskState, setTaskState] = useState<TaskState>();
  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  // update task state based on space selected
  useEffect(() => {
    initLocalState();

    async function initLocalState() {
      if (!selectedListId && !location.state) {
        setTaskState(undefined);
        setTaskStateContext(null);
        return;
      }

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

      const listDataFromApi = fetchLocalTaskList(selectedListId);

      // init taskEvents and convert expectedDueDate to dueDate
      const taskList = processTaskList(
        reorderedDueDateColumns,
        listDataFromApi
      );

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

      await sleep(0);
      setLoading(false);
    }
  }, [selectedListId, location.state]);

  // Sync up orderedTasks with columns under sortBy
  const statusColumnCount = taskState?.columnOptions.statusColumns.length;
  useEffect(() => {
    updateLocalState();

    async function updateLocalState() {
      if (!taskState || !taskStateContext) {
        return;
      }

      setLoading(true);

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

      await sleep(0);
      setLoading(false);
    }
  }, [sortBy, statusColumnCount]); // Change of sortBy and adding status column

  // sync up with modal task after task updated in modal
  useEffect(() => {
    if (task && taskState) {
      const allTasks = collectAllTasks(taskState.orderedTasks);
      const updatedTask = allTasks.find(
        (currentTask) => currentTask.id === task.id
      );
      if (updatedTask) setTask(updatedTask);
    }
  }, [taskState]);

  return { taskState, setTaskState, loading };
}
