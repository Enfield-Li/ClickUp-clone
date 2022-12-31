import {
  Modal,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import {
  CreateSpaceState,
  CreateSpaceDTO,
  CreateSpaceStep,
} from "../../../types";
import EnterSpaceName from "./EnterSpaceName";
import ReviewCreateSpace from "./ReviewCreateSpace";
import SpaceColorSetting from "./SpaceColorSetting";
import SpaceColumnsSetting from "./SpaceColumnsSetting";
import SpacePrivateSetting from "./SpacePrivateSetting";

type Props = { isOpen: boolean; onClose: () => void };

const initCreateSpaceDTO: CreateSpaceDTO = {
  name: "",
  color: "gray",
  orderIndex: 0,
  isPrivate: false,
  statusColumnsCategoryId: 0,
};

const initialCreateSpace: CreateSpaceState = {
  createSpaceDTO: initCreateSpaceDTO,
  isAllSet: false,
  selectedStatusColumns: [],
  step: CreateSpaceStep.NAME,
};

export default memo(CreateSpaceModal);
function CreateSpaceModal({ isOpen, onClose }: Props) {
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] =
    useState<CreateSpaceState>(initialCreateSpace);
  const isAllSet = createSpace.isAllSet;

  function redirectToReview(createSpaceStep: CreateSpaceStep) {
    return isAllSet ? CreateSpaceStep.CONFIRM : createSpaceStep;
  }

  useEffect(() => {
    if (!isOpen) {
      onClose();
      setCreateSpace(initialCreateSpace);
    }
  }, [isOpen]);

  function renderStepComponent() {
    switch (createSpace.step) {
      case CreateSpaceStep.NAME: {
        return (
          <EnterSpaceName
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }
      case CreateSpaceStep.COLOR: {
        return (
          <SpaceColorSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.IS_PRIVATE: {
        return (
          <SpacePrivateSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.STATUS_COLUMNS: {
        return (
          <SpaceColumnsSetting
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
            redirectToReview={redirectToReview}
          />
        );
      }
      case CreateSpaceStep.CONFIRM: {
        return (
          <ReviewCreateSpace
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
      isOpen={isOpen}
      onClose={onClose}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent bgColor={contentBgColor} height="530px">
        {renderStepComponent()}
      </ModalContent>
    </Modal>
  );
}
