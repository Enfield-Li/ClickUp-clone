import {
  Modal,
  ModalOverlay,
  ModalContent,
  Image,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Center,
  Button,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { CreateTeamDTO } from "./CreateTeam";

type Props = {
  isOpen: boolean;
  updatedImg: string;
  originalImg: string;
  onClose: () => void;
  onCancel: () => void;
  onImgSelect: (imgOutput: string) => void;
};

export default function EditAvatarModal({
  isOpen,
  onClose,
  onCancel,
  updatedImg,
  originalImg,
  onImgSelect,
}: Props) {
  const editor = useRef<AvatarEditor>(null);
  const [zoomScale, setZoomScale] = useState(100);

  function handleOutputImg() {
    if (editor.current) {
      const imgOutput = editor.current
        .getImageScaledToCanvas()
        .toDataURL("image/png");
      onImgSelect(imgOutput);
    }
  }

  function handleDragSlider(zoomValue: number) {
    handleOutputImg();
    setZoomScale(zoomValue);
  }

  function onModalClose() {
    onClose();
    setZoomScale(100);
  }

  function onModalCancel() {
    onCancel();
    setZoomScale(100);
  }

  return (
    <Modal isOpen={isOpen} onClose={onModalClose} size="2xl">
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton onClick={onModalCancel} />

        {originalImg && (
          <Flex>
            {/* Img editor */}
            <AvatarEditor
              rotate={0}
              border={50}
              width={250}
              ref={editor}
              height={250}
              borderRadius={200}
              image={originalImg}
              color={[0, 0, 0, 0.4]}
              scale={zoomScale / 100}
              backgroundColor="black"
              onMouseMove={handleOutputImg}
              onImageReady={handleOutputImg}
            />

            <Slider
              mx="2"
              mb="5"
              min={100}
              max={200}
              minH="32"
              alignSelf="end"
              value={zoomScale}
              orientation="vertical"
              onChange={handleDragSlider}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            {/* Img output */}
            <Center flexDir="column" flexGrow="1">
              <Image
                width="140px"
                height="140px"
                rounded="full"
                src={updatedImg}
              />

              {/* Confirm button */}
              <Button
                mt="3"
                size="sm"
                _focus={{}}
                _active={{}}
                rounded="sm"
                color="white"
                onClick={onModalClose}
                bgColor="customBlue.200"
                _hover={{ bgColor: "customBlue.100" }}
              >
                Save
              </Button>
            </Center>
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
}
