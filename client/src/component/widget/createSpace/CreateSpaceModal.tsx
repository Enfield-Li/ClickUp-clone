import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { useModalControl } from "../../../context/modalControl/useModalControl";
import { useTeam } from "../../../context/team/useTeam";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import CreateSpaceColor from "./CreateSpaceColor";
import { initialCreateSpace } from "./createSpaceInitialState";
import CreateSpaceName from "./CreateSpaceName";
import CreateSpaceReview from "./CreateSpaceReview";
import CreateSpaceSetPrivacy from "./CreateSpaceSetPrivacy";
import CreateSpaceStatusColumns from "./CreateSpaceStatusColumns";

type Props = {};

export default memo(CreateSpaceModal);
function CreateSpaceModal({}: Props) {
  const { teamsForRender } = useTeam();
  const { isCreateSpaceModalOpen, onCreateSpaceModalClose } = useModalControl();
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpaceState, setCreateSpaceState] =
    useState<CreateSpaceState>(initialCreateSpace);
  const isAllSet = createSpaceState.isAllSet;
  //   console.log(createSpace);

  function redirectToReview(createSpaceStep: CreateSpaceStep) {
    return isAllSet ? CreateSpaceStep.CONFIRM : createSpaceStep;
  }

  useEffect(() => {
    if (isCreateSpaceModalOpen) {
      const team = teamsForRender.find((team) => team.isSelected);
      if (!team) {
        throw new Error("Can not find team when create folder");
      }

      const teamId = team.id;
      const lastOrderIndex = team.spaces.length
        ? team.spaces[team.spaces.length - 1].orderIndex
        : 0;

      fetchTeamStatusCategories(Number(teamId), (StatusCategories) => {
        setCreateSpaceState(
          produce(createSpaceState, (draftState) => {
            draftState.teamStatusCategories = StatusCategories;

            draftState.createSpaceDTO.orderIndex = lastOrderIndex + 1;
            draftState.createSpaceDTO.defaultStatusCategoryId =
              StatusCategories[0].id!;
          })
        );
      });
    }
  }, [isCreateSpaceModalOpen, teamsForRender]);

  function handleCloseModal() {
    onCreateSpaceModalClose();
    setCreateSpaceState(initialCreateSpace);
  }

  function renderStepComponent() {
    switch (createSpaceState.step) {
      case CreateSpaceStep.NAME: {
        return (
          <CreateSpaceName
            createSpace={createSpaceState}
            setCreateSpace={setCreateSpaceState}
          />
        );
      }
      case CreateSpaceStep.COLOR: {
        return (
          <CreateSpaceColor
            createSpaceState={createSpaceState}
            setCreateSpace={setCreateSpaceState}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <CreateSpaceSetPrivacy
            createSpaceState={createSpaceState}
            setCreateSpaceState={setCreateSpaceState}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <CreateSpaceStatusColumns
            createSpaceState={createSpaceState}
            setCreateSpaceState={setCreateSpaceState}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return (
          <CreateSpaceReview
            createSpaceState={createSpaceState}
            setCreateSpaceState={setCreateSpaceState}
          />
        );
      }

      default: {
        throw new Error("CreateSpaceModal step failed");
      }
    }
  }

  return (
    <Modal
      size="2xl"
      onClose={handleCloseModal}
      isOpen={isCreateSpaceModalOpen}
    >
      <ModalOverlay />
      <ModalContent bgColor={contentBgColor} height="530px">
        {renderStepComponent()}
      </ModalContent>
    </Modal>
  );
}
