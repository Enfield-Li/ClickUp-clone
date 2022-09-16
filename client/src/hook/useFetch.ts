import axios, { AxiosError } from "axios";
import { useState } from "react";
import useGlobalContext, {
  indicateLoading,
  popUpError,
} from "./useGlobalContext";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const { globalDispatch } = useGlobalContext();

  async function fetchData() {
    try {
      setLoading(true);
      indicateLoading(true, globalDispatch);

      const response = await axios.get<T>(url);
      setData(response.data);
    } catch (error) {
      setError(true);
      const err = error as AxiosError;
      popUpError(err.message, globalDispatch);
      console.log(err);
    }
  }

  fetchData();

  setLoading(false);
  indicateLoading(false, globalDispatch);

  return { data, loading, error };
}
