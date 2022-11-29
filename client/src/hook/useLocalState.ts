import { useEffect, useState } from "react";
import { Params, useNavigate, useParams } from "react-router-dom";
import { initColumns } from "../component/task/actions/columnProcessing";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { CLIENT_ROUTE, TASK_BOARD_PARAM } from "../constant";
import useAuthContext from "../context/auth/useAuthContext";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { ColumnOptions, SortBy, StatusColumns, TaskState } from "../types";
import { sleep } from "../utils/sleep";
import {
  space1StatusColumns,
  space1TaskList,
  space2StatusColumns,
  space2TaskList,
  staticColumnOptions,
} from "./mockData";

interface UseLocalTasksParam {
  sortBy: SortBy;
}
export function useLocalTasks({ sortBy }: UseLocalTasksParam) {
  const param = useParams();
  let panelId = Number(param[TASK_BOARD_PARAM]);

  const navigate = useNavigate();
  const { authState } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [taskState, setTaskState] = useState<TaskState>();
  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  // update task state based on space selected
  useEffect(() => {
    initLocalState();

    async function initLocalState() {
      if (panelId) {
        setLoading(true);

        const statusColumnsDataFromApi: StatusColumns =
          panelId === 1 ? space1StatusColumns : space2StatusColumns;

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

        const listDataFromApi = panelId === 1 ? space1TaskList : space2TaskList;

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

        await sleep(0);
        setLoading(false);
      }
    }
  }, [panelId]);

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
