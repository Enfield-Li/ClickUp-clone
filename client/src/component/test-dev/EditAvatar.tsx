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
import { CreateTeamState } from "./CreateTeam";

type Props = {
  isOpen: boolean;
  imgString: string;
  onClose: () => void;
  team: CreateTeamState;
  setTeam: React.Dispatch<React.SetStateAction<CreateTeamState>>;
};

export default function EditAvatarModal({
  team,
  isOpen,
  onClose,
  setTeam,
  imgString,
}: Props) {
  const editor = useRef<AvatarEditor>(null);
  const [scale, setScale] = useState(100);
  console.log(scale);

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
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton onClick={() => setTeam({ ...team, avatar: "" })} />

        {imgString && (
          <Flex>
            <AvatarEditor
              rotate={0}
              border={50}
              width={250}
              ref={editor}
              height={250}
              image={imgString}
              borderRadius={200}
              scale={scale / 100}
              color={[0, 0, 0, 0.4]}
              backgroundColor="black"
              onMouseMove={handleUpdateAvatar}
              onImageReady={handleUpdateAvatar}
            />
            <Slider
              mx="2"
              mb="5"
              min={100}
              max={200}
              minH="32"
              value={scale}
              alignSelf="end"
              onChange={setScale}
              orientation="vertical"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <Center flexDir="column" flexGrow="1">
              <Image
                width="140px"
                height="140px"
                rounded="full"
                src={team.avatar}
              />
              <Button
                mt="3"
                size="sm"
                _focus={{}}
                _active={{}}
                rounded="sm"
                color="white"
                onClick={onClose}
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
