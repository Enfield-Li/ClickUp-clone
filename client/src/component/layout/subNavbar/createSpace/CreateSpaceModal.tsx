import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import produce from "immer";
import { ChangeEvent, useEffect, useState } from "react";
import { CreateSpaceDTO } from "../../../../types";
import EnterSpaceName from "./EnterSpaceName";
import PickSpaceColor from "./PickSpaceColor";

type Props = { isOpen: boolean; onClose: () => void };

export enum Step {
  NAME = "name",
  COLOR = "color",
  IS_PRIVATE = "is_private",
  STATUS_COLUMNS = "status_columns",
  CONFIRM = "confirm",
}
export interface CreateSpace {
  step: Step;
  isAllSet: boolean;
  createSpaceDTO: CreateSpaceDTO;
}

const createSpaceDTO: CreateSpaceDTO = {
  name: "",
  color: "gray",
  orderIndex: null,
  isPrivate: false,
};

const initCreateSpace: CreateSpace = {
  step: Step.NAME,
  isAllSet: false,
  createSpaceDTO,
};

export default function CreateSpaceModal({ isOpen, onClose }: Props) {
  const contentBgColor = useColorModeValue("white", "darkMain.100");
  const [createSpace, setCreateSpace] = useState<CreateSpace>(initCreateSpace);

  useEffect(() => {
    if (!isOpen) {
      onClose();
      setCreateSpace(initCreateSpace);
    }
  }, [isOpen]);

  function renderStepComponent() {
    switch (createSpace.step) {
      case Step.NAME: {
        return (
          <EnterSpaceName
            createSpace={createSpace}
            setCreateSpace={setCreateSpace}
          />
        );
      }

      case Step.COLOR: {
        return (
          <PickSpaceColor
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
        <>{renderStepComponent()}</>
        {/* <PickSpaceColor
          createSpace={createSpace}
          setCreateSpace={setCreateSpace}
        /> */}
      </ModalContent>
    </Modal>
  );
}
