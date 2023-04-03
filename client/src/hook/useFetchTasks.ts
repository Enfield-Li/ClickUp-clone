import { useEffect } from "react";
import { collectAllTasks } from "../component/task/actions/taskProcessing";
import { useTaskDetail } from "../context/task_detail/useTaskDetail";
import { fetchAllTasks as fetchTasksAndStatusCategory } from "../networkCalls";
import { GroupBy } from "../types";

interface UseFetchTasksParam {
  groupBy: GroupBy;
  listId: number;
  statusCategoryId: number | undefined;
}
export function useColumnTaskState({
  groupBy,
  listId,
  statusCategoryId,
}: UseFetchTasksParam) {
  const {
    task,
    taskState,
    taskStateContext,
    selectTask,
    initTaskStateContext,
    updateTaskStateContext,
  } = useTaskDetail();

  useEffect(() => {
    initTaskState();

    async function initTaskState() {
      if (!listId || !statusCategoryId) {
        return;
      }

      // Task data
      const networkData = await fetchTasksAndStatusCategory(
        listId,
        statusCategoryId
      );

      initTaskStateContext({ groupBy, listId, networkData, statusCategoryId });
    }
  }, [listId, statusCategoryId]);

  // Sync up orderedTasks with columns under groupBy
  const statusColumnCount =
    taskStateContext?.columnOptions.statusColumns.length;
  useEffect(() => {
    updateTaskStateContext(groupBy);
  }, [groupBy, statusColumnCount]); // Change of groupBy and adding status column

  // sync up with modal task
  useEffect(() => {
    if (task && taskState) {
      const allTasks = collectAllTasks(taskState.orderedTasks);
      const updatedTask = allTasks.find(
        (currentTask) => currentTask.id === task.id
      );
      if (updatedTask) selectTask(updatedTask);
    }
  }, [taskState]);
}
