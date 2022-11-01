import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { processColumns } from "../component/task/actions/columnProcessing";
import { fetchAllTasks } from "../component/task/actions/TaskActions";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { SortBy, State } from "../component/task/taskTypes";
import useGlobalContext from "../context/global/useGlobalContext";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../utils/AxiosInterceptor";
import { mockColumnOptions } from "../utils/mockData";
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
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { setTaskStateContext, taskStateContext } = useTaskDetailContext();

  useEffect(() => {
    fetchData();
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    updateLocalState();
  }, [sortBy, state?.columnOptions.status]); // Change of sortBy and adding status column

  async function fetchData() {
    setLoading(true);

    // Task data
    const tasksData = await fetchAllTasks();

    if (tasksData) {
      const columnDataFromApi = mockColumnOptions;

      const { dueDateColumns, statusColumns } =
        processColumns(columnDataFromApi);

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

      setTaskStateContext({ columnOptions, setState, sortBy });
      setState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }

  async function updateLocalState() {
    setLoading(true);

    if (state && taskStateContext) {
      setTaskStateContext({
        ...taskStateContext,
        sortBy,
        columnOptions: state.columnOptions,
      });

      // init taskEvents and convert expectedDueDate to dueDate columns
      const taskList = processTaskList(
        state.columnOptions.dueDate,
        collectAllTasks(state.orderedTasks)
      );

      setState({
        ...state,
        orderedTasks: groupTaskListOnSortBy(
          taskList,
          state.columnOptions[sortBy],
          sortBy
        ),
      });

      await sleep(0);
    }

    setLoading(false);
  }

  return { state, setState, loading, error };
}
