import { useEffect, useState } from "react";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { ColumnOptions, SortBy, StatusColumns, TaskState } from "../types";
import { sleep } from "../utils/sleep";
import {
  space1TaskList,
  staticColumnOptions,
  space1StatusColumns,
  space2StatusColumns,
  space2TaskList,
} from "./mockData";

interface UseLocalTasksParam {
  sortBy: SortBy;
  spaceId: number;
}
export function useLocalTasks({ sortBy, spaceId }: UseLocalTasksParam) {
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(false);
  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  useEffect(() => {
    initLocalState();

    function initLocalState() {
      setLoading(true);

      const statusColumnsDataFromApi: StatusColumns =
        spaceId === 1 ? space1StatusColumns : space2StatusColumns;

      const columnDataFromApi: ColumnOptions = {
        dueDateColumns: staticColumnOptions.dueDateColumns,
        priorityColumns: staticColumnOptions.priorityColumns,
        statusColumns: statusColumnsDataFromApi,
      };
      const { reorderedDueDateColumns, reorderedStatusColumns } =
        initColumns(columnDataFromApi);

      const columnOptions: ColumnOptions = {
        ...columnDataFromApi,
        dueDateColumns: reorderedDueDateColumns,
        statusColumns: reorderedStatusColumns,
      };

      const listDataFromApi = spaceId === 1 ? space1TaskList : space2TaskList;

      // init taskEvents and convert expectedDueDate to dueDate
      const taskList = processTaskList(
        reorderedDueDateColumns,
        listDataFromApi
      );

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[`${sortBy}Columns`],
        sortBy
      );

      setTaskStateContext({ columnOptions, setTaskState, sortBy });
      setTaskState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }, [spaceId]);

  // Sync up orderedTasks with columns under sortBy
  const statusColumnCount = taskState?.columnOptions.statusColumns.length;
  useEffect(() => {
    updateLocalState();

    async function updateLocalState() {
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

        await sleep(0);
        setLoading(false);
      }
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

  return { taskState, setTaskState, loading };
}
