import { Flex } from "@chakra-ui/react";
import { memo, useState } from "react";
import { useModalControl } from "../../context/modalControl/useModalControl";
import { GroupBy } from "../../types";
import TaskDetailsModal from "../taskModal/TaskDetailsModal";
import TaskFilterTopBar from "./filterOptions/TaskFilterTopBar";
import TaskBoardView from "./TaskBoardView";

type Props = {};

export default memo(TaskView);
function TaskView({}: Props) {
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.STATUS);
  const { isTaskDetailModalOpen } = useModalControl();

  return (
    <Flex flexDir="column" height="100%">
      <TaskFilterTopBar groupBy={groupBy} setSortBy={setGroupBy} />
      <TaskBoardView groupBy={groupBy} />

      {isTaskDetailModalOpen && <TaskDetailsModal />}
    </Flex>
  );
}
