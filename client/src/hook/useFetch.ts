import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SortBy, State, TaskList } from "../component/task/taskTypes";
import {
  collectAllTasks,
  processTaskList,
  groupTaskListOnSortBy,
  processLocalTaskList,
} from "../component/task/actions/taskProcessing";
import useGlobalContext from "../context/global/useGlobalContext";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { axiosInstance } from "../utils/AxiosInterceptor";
import { mockColumnOptions, mockTaskList } from "../utils/mockData";
import {
  initializeDueDataColumns,
  processColumns,
} from "../component/task/actions/columnProcessing";
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

export function useFetchTasks(url: string, sortBy: SortBy) {
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
  }, [sortBy]);

  async function fetchData() {
    try {
      setLoading(true);

      // Task data
      const response = await axiosInstance.get<TaskList>(url);
      const columnDataFromApi = mockColumnOptions;

      const dueDateColumns = initializeDueDataColumns(
        columnDataFromApi.dueDate
      );

      const columnOptions = { ...columnDataFromApi, dueDate: dueDateColumns };

      // init taskEvents and convert expectedDueDate to dueDate
      const taskList = processTaskList(dueDateColumns, response.data);

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[sortBy],
        sortBy
      );

      setTaskStateContext({ columnOptions, setState, sortBy });
      setState({ orderedTasks, columnOptions: columnOptions });
    } catch (error) {
      setError(true);
      const err = error as AxiosError;
      console.log(err);
    } finally {
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

      setState({
        ...state,
        orderedTasks: groupTaskListOnSortBy(
          collectAllTasks(state.orderedTasks),
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
