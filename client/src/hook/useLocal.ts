import { useState, useEffect } from "react";
import { processColumns } from "../component/task/actions/columnProcessing";
import {
  processLocalTaskList,
  groupTaskListOnSortBy,
  collectAllTasks,
} from "../component/task/actions/taskProcessing";
import { SortBy, State } from "../component/task/taskTypes";
import useTaskDetailContext from "../context/task_detail/useTaskDetailContext";
import { mockColumnOptions, mockTaskList } from "../utils/mockData";
import { sleep } from "../utils/sleep";

export function useLocalTasks(sortBy: SortBy) {
  const [state, setState] = useState<State>();
  const [loading, setLoading] = useState(false);
  const { setTaskStateContext, taskStateContext } = useTaskDetailContext();

  useEffect(() => {
    initLocalState();
  }, []);

  // Sync up orderedTasks with columns under sortBy
  useEffect(() => {
    updateLocalState();
  }, [sortBy, state?.columnOptions.status]); // Change of sortBy and adding status column

  function initLocalState() {
    setLoading(true);
    const columnDataFromApi = mockColumnOptions;

    const { dueDateColumns, statusColumns } = processColumns(columnDataFromApi);

    const columnOptions = {
      ...columnDataFromApi,
      dueDate: dueDateColumns,
      status: statusColumns,
    };

    // init taskEvents and convert expectedDueDate to dueDate
    const taskList = processLocalTaskList(dueDateColumns, mockTaskList);

    const orderedTasks = groupTaskListOnSortBy(
      taskList,
      columnDataFromApi[sortBy],
      sortBy
    );

    setTaskStateContext({ columnOptions, setState, sortBy });
    setState({ orderedTasks, columnOptions });

    setLoading(false);
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
      setLoading(false);
    }
  }

  return { state, setState, loading };
}
