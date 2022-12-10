import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { initColumns } from "../component/task/actions/columnProcessing";
import { fetchAllTasks } from "../component/task/actions/networkActions";
import {
  collectAllTasks,
  groupTaskListOnSortBy,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { ColumnOptions, SortBy, TaskList, TaskState } from "../types";
import useSpaceListContext from "../context/team/useTeamContext";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { axiosGatewayInstance } from "../utils/AxiosInterceptor";
import { staticColumnOptions } from "./mockData";
import { sleep } from "../utils/sleep";
import { useToast } from "@chakra-ui/react";

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();

  async function fetchData() {
    try {
      setLoading(true);
      // indicateLoading(true, globalDispatch);

      const response = await axiosGatewayInstance.get<T>(url);
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
  const toast = useToast();
  const [taskState, setTaskState] = useState<TaskState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { task, setTask, taskStateContext, setTaskStateContext } =
    useTaskDetailContext();

  useEffect(() => {
    initTaskState();
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    updateTaskState();
  }, [sortBy, taskState?.columnOptions.statusColumns]); // Change of sortBy and adding status column

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

  async function initTaskState() {
    setLoading(true);

    // Task data
    const tasksData: TaskList | undefined = await fetchAllTasks(() =>
      toast({
        colorScheme: "red",
        description: "Service unavailable, please retry...",
      })
    );

    if (tasksData) {
      const columnDataFromApi = staticColumnOptions;

      const { reorderedDueDateColumns, reorderedStatusColumns } =
        initColumns(columnDataFromApi);

      const columnOptions: ColumnOptions = {
        ...columnDataFromApi,
        dueDateColumns: reorderedDueDateColumns,
        statusColumns: reorderedStatusColumns,
      };

      // init taskEvents and convert expectedDueDate to dueDate columns
      const taskList = processTaskList(reorderedDueDateColumns, tasksData);

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[`${sortBy}Columns`],
        sortBy
      );

      setTaskStateContext({ columnOptions, setTaskState, sortBy });
      setTaskState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }

  async function updateTaskState() {
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
          taskState.columnOptions[`${sortBy}Columns`],
          sortBy
        ),
      });

      await sleep(0);
    }

    setLoading(false);
  }

  return { taskState, setTaskState, loading, error };
}
