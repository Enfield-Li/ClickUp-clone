import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { initColumns } from "../component/task/actions/columnProcessing";
import { fetchAllTasks } from "../component/task/actions/networkActions";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { SortBy, TaskState } from "../types";
import useGlobalContext from "../context/global/useGlobalContext";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../utils/AxiosInterceptor";
import { mockColumnOptions } from "../useLocalState/mockData";
import { sleep } from "../utils/sleep";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const { globalDispatch } = useGlobalContext();

  async function fetchData() {
    try {
      setLoading(true);
      // indicateLoading(true, globalDispatch);

      const response = await axiosInstance.get<T>(url);
      setData(response.data);
    } catch (error) {
      setError(true);
      const err = error as AxiosError;
      // popUpError(err.message, globalDispatch);
      console.log(err);
    }
  }

  fetchData();

  setLoading(false);
  // indicateLoading(false, globalDispatch);

  return { data, loading, error };
}

export function useFetchTasks(sortBy: SortBy) {
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setTaskStateContext, taskStateContext } = useTaskDetailContext();

  useEffect(() => {
    fetchData();
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    updateLocalState();
  }, [sortBy, taskState?.columnOptions.statusColumns]); // Change of sortBy and adding status column

  async function fetchData() {
    setLoading(true);

    // Task data
    const tasksData = await fetchAllTasks();

    if (tasksData) {
      const columnDataFromApi = mockColumnOptions;

      const { dueDateColumns, statusColumns } = initColumns(columnDataFromApi);

      const columnOptions = {
        ...columnDataFromApi,
        dueDate: dueDateColumns,
        status: statusColumns,
      };

      // init taskEvents and convert expectedDueDate to dueDate columns
      const taskList = processTaskList(dueDateColumns, tasksData);

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[sortBy],
        sortBy
      );

      setTaskStateContext({ columnOptions, setTaskState, sortBy });
      setTaskState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }

  async function updateLocalState() {
    setLoading(true);

    if (taskState && taskStateContext) {
      setTaskStateContext({
        ...taskStateContext,
        sortBy,
        columnOptions: taskState.columnOptions,
      });

      // init taskEvents and convert expectedDueDate to dueDate columns
      const taskList = processTaskList(
        taskState.columnOptions.dueDateColumns,
        collectAllTasks(taskState.orderedTasks)
      );

      setTaskState({
        ...taskState,
        orderedTasks: groupTaskListOnSortBy(
          taskList,
          taskState.columnOptions[sortBy],
          sortBy
        ),
      });

      await sleep(0);
    }

    setLoading(false);
  }

  return { taskState, setTaskState, loading, error };
}
