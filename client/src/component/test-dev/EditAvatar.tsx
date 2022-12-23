import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { InitTeam } from "./MultiStepForm";

type Props = {
  team: InitTeam;
  isOpen: boolean;
  imgString: string;
  onClose: () => void;
  setTeam: React.Dispatch<React.SetStateAction<InitTeam>>;
};

export default function EditAvatarModal({
  team,
  isOpen,
  onClose,
  setTeam,
  imgString,
}: Props) {
  const editor = useRef<AvatarEditor>(null);

  function handleUpdateAvatar() {
    if (editor.current) {
      const canvasScaled = editor.current.getImageScaledToCanvas();
      setTeam({
        ...team,
        avatar: canvasScaled.toDataURL("image/png"),
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {imgString && (
          <>
            <AvatarEditor
              rotate={0}
              scale={1.5}
              border={50}
              width={250}
              ref={editor}
              height={250}
              image={imgString}
              borderRadius={200}
              color={[0, 0, 0, 0.6]}
              backgroundColor="black"
              onMouseMove={handleUpdateAvatar}
            />

            <img alt="not fount" width={"250px"} src={team.avatar} />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
