import { Flex } from "@chakra-ui/react";
import { memo } from "react";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import StatusColumnsDisplay from "../statusColumn/StatusColumnsDisplay";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpace: CreateSpaceState;
  redirectToReview(createSpaceStep: CreateSpaceStep): CreateSpaceStep;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceStatusColumns);
function CreateSpaceStatusColumns({
  createSpace,
  setCreateSpace,
  redirectToReview,
}: Props) {
  return (
    <CreateSpaceModalTemplate
      createSpace={createSpace}
      setCreateSpace={setCreateSpace}
      previousSection={CreateSpaceStep.IS_PRIVATE}
      sectionName="What task statuses do you want?"
      nextSection={redirectToReview(CreateSpaceStep.CONFIRM)}
    >
      <Flex pt="6" height="100%" alignItems="center">
        <StatusColumnsDisplay setCreateSpace={setCreateSpace} />
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
