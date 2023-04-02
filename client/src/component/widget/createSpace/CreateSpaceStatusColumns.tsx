import { Flex } from "@chakra-ui/react";
import produce from "immer";
import { memo } from "react";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import StatusColumnsDisplay from "../statusColumn/StatusColumnsDisplay";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";

type Props = {
  createSpaceState: CreateSpaceState;
  redirectToReview(createSpaceStep: CreateSpaceStep): CreateSpaceStep;
  setCreateSpaceState: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceStatusColumns);
function CreateSpaceStatusColumns({
  createSpaceState,
  redirectToReview,
  setCreateSpaceState,
}: Props) {
  return (
    <CreateSpaceModalTemplate
      createSpaceState={createSpaceState}
      setCreateSpace={setCreateSpaceState}
      previousSection={CreateSpaceStep.IS_PRIVATE}
      sectionName="What task statuses do you want?"
      nextSection={redirectToReview(CreateSpaceStep.CONFIRM)}
    >
      <Flex pt="6" height="100%">
        <StatusColumnsDisplay
          selectedCategoryId={
            createSpaceState.createSpaceDTO.defaultStatusCategoryId
          }
          teamStatusCategories={createSpaceState.teamStatusCategories}
          handleSelectCategory={(selectedCategory) =>
            setCreateSpaceState((prev) =>
              produce(prev, (draftState) => {
                draftState.selectedStatusColumns =
                  selectedCategory.statusColumns;
                draftState.createSpaceDTO.defaultStatusCategoryId =
                  selectedCategory.id;
              })
            )
          }
          handleUpdateCategories={(updatedStatusCategories) =>
            setCreateSpaceState((prev) =>
              produce(prev, (draftState) => {
                draftState.teamStatusCategories = updatedStatusCategories;
              })
            )
          }
        />
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
