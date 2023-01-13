import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { fetchTeamStatusCategories } from "../../../networkCalls";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import CreateSpaceColor from "./CreateSpaceColor";
import { initialCreateSpace } from "./createSpaceInit";
import CreateSpaceName from "./CreateSpaceName";
import CreateSpaceReview from "./CreateSpaceReview";
import CreateSpaceSetPrivacy from "./CreateSpaceSetPrivacy";
import CreateSpaceStatusColumns from "./CreateSpaceStatusColumns";

type Props = {};

export default memo(CreateSpaceModal);
function CreateSpaceModal({}: Props) {
  const {
    teamState,
    modalControls: { isCreateSpaceModalOpen, onCreateSpaceModalClose },
  } = useTeamStateContext();
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] =
    useState<CreateSpaceState>(initialCreateSpace);
  const isAllSet = createSpace.isAllSet;
  //   console.log(createSpace);

  function redirectToReview(createSpaceStep: CreateSpaceStep) {
    return isAllSet ? CreateSpaceStep.CONFIRM : createSpaceStep;
  }

  useEffect(() => {
    if (isCreateSpaceModalOpen) {
      const team = teamState.teams.find((team) => team.isSelected);
      if (!team) {
        throw new Error("Can not find team when create folder");
      }

      const teamId = team.id;
      const lastOrderIndex = team.spaces[team.spaces.length - 1].orderIndex;

      fetchTeamStatusCategories(Number(teamId), (StatusCategories) => {
        setCreateSpace(
          produce(createSpace, (draftState) => {
            draftState.teamStatusCategories = StatusCategories;

            draftState.createSpaceDTO.orderIndex = lastOrderIndex + 1;
            draftState.createSpaceDTO.statusColumnsCategoryId =
              StatusCategories[0].id!;
          })
        );
      });
    }
  }, [isCreateSpaceModalOpen, teamState]);

  function handleCloseModal() {
    onCreateSpaceModalClose();
    setCreateSpace(initialCreateSpace);
  }

  function renderStepComponent() {
    switch (createSpace.step) {
      case CreateSpaceStep.NAME: {
        return (
          <CreateSpaceName
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.COLOR: {
        return (
          <CreateSpaceColor
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <CreateSpaceSetPrivacy
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <CreateSpaceStatusColumns
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return (
          <CreateSpaceReview
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
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
