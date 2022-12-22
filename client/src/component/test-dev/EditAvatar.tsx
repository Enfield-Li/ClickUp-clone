import { Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { InitTeam } from "./MultiStepForm";

type Props = {
  isOpen: boolean;
  imgString: string;
  onClose: () => void;
  setTeam: React.Dispatch<React.SetStateAction<InitTeam>>;
};

export default function EditAvatarModal({ onClose, isOpen, imgString }: Props) {
  const editor = useRef<AvatarEditor>(null);
  const [imgStringUpdated, setImgStringUpdated] = useState("");

  function handleClose() {
    onClose();
    setImgStringUpdated("");
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
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
              onMouseUp={() => console.log("onMouseUp")}
              onMouseMove={() => {
                if (editor.current) {
                  const canvasScaled = editor.current.getImageScaledToCanvas();
                  setImgStringUpdated(canvasScaled.toDataURL("image/png"));
                }
              }}
            />

            <img alt="not fount" width={"250px"} src={imgStringUpdated} />
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
