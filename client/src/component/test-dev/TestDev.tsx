import {
  Box,
  Center,
  Divider,
  Flex,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FileUploader } from "react-drag-drop-files";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const fileTypes = ["JPEG", "PNG", "GIF"];
export default function TestDev() {
  const editor = useRef<AvatarEditor>(null);
  //   const [file, setFile] = useState<File | undefined>();
  const [imgString, setImageString] = useState("");
  const [imgStringUpdated, setImgStringUpdated] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log({ updatedImg: imgString });

  useEffect(() => {
    if (imgString) {
      onOpen();
    }
  }, [imgString]);

  async function handleChange(file: File) {
    setImageString(await toBase64(file));
  }

  return (
    <div>
      <Flex>
        <FileUploader
          name="file"
          multiple={false}
          types={fileTypes}
          handleChange={handleChange}
        >
          <Center
            width="120px"
            height="120px"
            rounded="full"
            flexDir="column"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="gray.400"
          >
            <Box opacity="35%">
              <i className="bi bi-cloud-upload"></i>
            </Box>

            <Center>Drop an image or browse</Center>
          </Center>
        </FileUploader>

        <Flex flexDir="column" alignItems="center">
          <Divider
            opacity="100%"
            borderColor="blackAlpha.600"
            orientation="vertical"
          />
          <Box>or</Box>
          <Divider
            opacity="100%"
            borderColor="blackAlpha.600"
            orientation="vertical"
          />
        </Flex>

        <Box>stuff</Box>
      </Flex>

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
                onMouseUp={() => console.log("onMouseUp")}
                onMouseMove={() => {
                  if (editor.current) {
                    const canvasScaled =
                      editor.current.getImageScaledToCanvas();
                    setImgStringUpdated(canvasScaled.toDataURL("image/png"));
                  }
                }}
              />

              <img alt="not fount" width={"250px"} src={imgStringUpdated} />
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
