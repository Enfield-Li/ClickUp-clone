import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  columnOptions,
  Columns,
  DueDateColumns,
  DUE_DATE,
  initialData,
  SortBy,
  State,
  StatusColumns,
  TaskList,
} from "../component/task/Data";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  renameAndReorderDueDateColumns,
} from "../component/task/TaskDataProcessing";
import useGlobalContext, {
  indicateLoading,
  popUpError,
} from "../context/global/useGlobalContext";
import { axiosInstance } from "../utils/AxiosInterceptor";

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
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    fetchData();
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        orderedTasks: groupTaskListOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  async function fetchData() {
    try {
      setLoading(true);

      // Task data
      const response = await axiosInstance.get<TaskList>(url);

      const columnDataFromApi = columnOptions;
      const tasksListData = response.data;

      const processedData = groupTaskListOnSortBy(
        tasksListData,
        columnDataFromApi[sortBy],
        sortBy
      );

      const dueDateColumns = renameAndReorderDueDateColumns(
        columnDataFromApi.dueDate
      );

      setState({
        orderedTasks: processedData,
        unorderedColumns: {
          ...columnDataFromApi,
          dueDate: dueDateColumns,
        },
      });
    } catch (error) {
      setError(true);
      const err = error as AxiosError;
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return { state, loading, error, setState };
}

export function useLocalTasks(sortBy: SortBy) {
  const [state, setState] = useState<State>();

  useEffect(() => {
    const columnDataFromApi = columnOptions;
    const dataFromAPI = initialData;

    const dueDateColumns = renameAndReorderDueDateColumns(
      columnOptions.dueDate
    );

    const processedTaskList = groupTaskListOnSortBy(
      dataFromAPI,
      columnDataFromApi[sortBy],
      sortBy
    );

    setState({
      orderedTasks: processedTaskList,
      unorderedColumns: {
        ...columnDataFromApi,
        dueDate: dueDateColumns,
      },
    });
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    if (state) {
      setState({
        ...state,
        orderedTasks: groupTaskListOnSortBy(
          collectAllTasks(state.orderedTasks),
          state.unorderedColumns[sortBy],
          sortBy
        ),
      });
    }
  }, [sortBy]);

  return { state, setState };
}
