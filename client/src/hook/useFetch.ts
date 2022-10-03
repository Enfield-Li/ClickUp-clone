import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { columnOptions, SortBy, State, TaskList } from "../component/task/Data";
import { processTaskBasedOnSortBy } from "../component/task/TaskDataProcessing";
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
  const [data, setData] = useState<State>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axiosInstance.get<TaskList>(url);

      const columnDataFromApi = columnOptions;
      const tasksListData = response.data;
      const processedData = processTaskBasedOnSortBy(
        tasksListData,
        columnDataFromApi[sortBy],
        sortBy
      );

      setData({
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

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
}
