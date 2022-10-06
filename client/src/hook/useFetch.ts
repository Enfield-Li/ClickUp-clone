import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import {
  columnOptions,
  Columns,
  DueDateColumns,
  initialData,
  SortBy,
  State,
  TaskList,
} from "../component/task/Data";
import {
  processTaskListOnSortBy,
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
  const [dueDateColumns, setDueDateColumns] = useState<DueDateColumns>();
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      // Task data
      const response = await axiosInstance.get<TaskList>(url);

      const columnDataFromApi = columnOptions;
      const tasksListData = response.data;

      const processedData = processTaskListOnSortBy(
        tasksListData,
        columnDataFromApi[sortBy],
        sortBy
      );

      // dueDate columns
      const processedDueDateColumns = renameAndReorderDueDateColumns(
        columnDataFromApi.dueDate
      );
      setDueDateColumns(processedDueDateColumns);

      setState({
        orderedTasks: processedData,
        unorderedColumns: columnDataFromApi,
      });
    } catch (error) {
      setError(true);
      const err = error as AxiosError;
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  return { state, loading, error, setState, dueDateColumns };
}

export function useLocalTasks(sortBy: SortBy) {
  const [state, setState] = useState<State>();
  const [dueDateColumns, setDueDateColumns] = useState<DueDateColumns>();

  useEffect(() => {
    const columnDataFromApi = columnOptions;
    const dataFromAPI = initialData;

    const processedDueDateColumns = renameAndReorderDueDateColumns(
      columnOptions.dueDate
    );

    const processedTaskList = processTaskListOnSortBy(
      dataFromAPI,
      columnDataFromApi[sortBy],
      sortBy
    );

    setDueDateColumns(processedDueDateColumns);
    setState({
      orderedTasks: processedTaskList,
      unorderedColumns: columnDataFromApi,
    });
  }, []);

  return { state, setState, dueDateColumns };
}
