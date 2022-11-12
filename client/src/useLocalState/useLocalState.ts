import { useState, useEffect } from "react";
import { processColumns } from "../component/task/actions/columnProcessing";
import {
  groupTaskListOnSortBy,
  collectAllTasks,
  processTaskList,
} from "../component/task/actions/taskProcessing";
import { SortBy, State } from "../types";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { mockColumnOptions, mockTaskList } from "./mockData";
import { sleep } from "../utils/sleep";

export function useLocalTasks(sortBy: SortBy) {
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState(false);
  const { setTaskStateContext, taskStateContext } = useTaskDetailContext();

  useEffect(() => {
    initLocalState();

    function initLocalState() {
      setLoading(true);
      const columnDataFromApi = mockColumnOptions;

      const { dueDateColumns, statusColumns } =
        processColumns(columnDataFromApi);

      const columnOptions = {
        ...columnDataFromApi,
        dueDate: dueDateColumns,
        status: statusColumns,
      };

      // init taskEvents and convert expectedDueDate to dueDate
      const taskList = processTaskList(dueDateColumns, mockTaskList);

      const orderedTasks = groupTaskListOnSortBy(
        taskList,
        columnDataFromApi[sortBy],
        sortBy
      );

      setTaskStateContext({ columnOptions, setState, sortBy });
      setState({ orderedTasks, columnOptions });

      setLoading(false);
    }
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    updateLocalState();

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
        setLoading(false);
      }
    }
  }, [sortBy, state?.columnOptions.status]); // Change of sortBy and adding status column

  return { state, setState, loading };
}
