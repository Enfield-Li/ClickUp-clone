import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import { CreateSpace, CreateSpaceStep } from "../../../../types";
import StatusColumnsDisplay from "../../../customStatusColumn/StatusColumnsDisplay";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpace;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpace>>;
};

export default memo(SpaceColumnsSetting);
function SpaceColumnsSetting({ createSpace, setCreateSpace }: Props) {
  return (
    <CreateSpaceModalTemplate
      createSpace={createSpace}
      nextSection={CreateSpaceStep.CONFIRM}
      setCreateSpace={setCreateSpace}
      previousSection={CreateSpaceStep.IS_PRIVATE}
      sectionName="What task statuses do you want?"
    >
      <Flex pt="6" height="100%" alignItems="center">
        <StatusColumnsDisplay />
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
