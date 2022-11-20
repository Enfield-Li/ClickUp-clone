import { useState, useEffect } from "react";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  groupTaskListOnSortBy,
  collectAllTasks,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { ColumnOptions, SortBy, TaskState } from "../types";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { mockColumnOptions, mockTaskList } from "./mockData";
import { sleep } from "../utils/sleep";

export function useLocalTasks(sortBy: SortBy) {
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(false);
  const { setTaskStateContext, taskStateContext } = useTaskDetailContext();

  useEffect(() => {
    initLocalState();

    function initLocalState() {
      setLoading(true);
      const columnDataFromApi = mockColumnOptions;

      const { reorderedDueDateColumns, reorderedStatusColumns } =
        initColumns(columnDataFromApi);

      const columnOptions: ColumnOptions = {
        ...columnDataFromApi,
        dueDateColumns: reorderedDueDateColumns,
        statusColumns: reorderedStatusColumns,
      };

      // init taskEvents and convert expectedDueDate to dueDate
      const taskList = processTaskList(reorderedDueDateColumns, mockTaskList);

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[`${sortBy}Columns`],
        sortBy
      );

      setTaskStateContext({ columnOptions, setTaskState, sortBy });
      setTaskState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }, []);

  // Sync up orderedTasks with columns under sortBy
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
  }, [sortBy, taskState?.columnOptions.statusColumns]); // Change of sortBy and adding status column

  return { taskState, setTaskState, loading };
}
