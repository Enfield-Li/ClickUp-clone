import { NotAllowedIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import produce from "immer";
import { memo, useState } from "react";
import { CreateSpaceState, CreateSpaceStep } from "../../../types";
import { spaceColors2D } from "../../../media/colors";
import CreateSpaceModalTemplate from "./CreateSpaceModalTemplate";
import { FileUploader } from "react-drag-drop-files";
import { imgFileToBase64String } from "../../../utils/imgFileToBase64String";
import EditAvatarModal from "../../createTeam/EditAvatar";

type Props = {
  createSpace: CreateSpaceState;
  redirectToReview(createSpaceStep: CreateSpaceStep): CreateSpaceStep;
  setCreateSpace: React.Dispatch<React.SetStateAction<CreateSpaceState>>;
};

export default memo(CreateSpaceColor);
function CreateSpaceColor({
  createSpace,
  setCreateSpace,
  redirectToReview,
}: Props) {
  const mx = "6.8px";
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const avatar = createSpace.createSpaceDTO.avatar;

  const [originalImgStr, setOriginalImgStr] = useState("");
  const borderColor = useColorModeValue("lightMain.200", "darkMain.400");
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  async function handleUploadImg(file: File) {
    onModalOpen();
    setOriginalImgStr(await imgFileToBase64String(file));
  }

  function handleCancelColor() {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.color = "gray";
      })
    );
  }

  function handlePickColor(color: string) {
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.avatar = "";
        draftState.createSpaceDTO.color = color;
      })
    );
  }

  function handleCloseModal() {
    onModalClose();
    setOriginalImgStr("");
  }

  function handleCancelEdit() {
    setOriginalImgStr("");
    setCreateSpace(
      produce(createSpace, (draftState) => {
        draftState.createSpaceDTO.avatar = "";
      })
    );
  }

  return (
    <CreateSpaceModalTemplate
      sectionName="Space color"
      createSpace={createSpace}
      setCreateSpace={setCreateSpace}
      previousSection={CreateSpaceStep.NAME}
      nextSection={redirectToReview(CreateSpaceStep.IS_PRIVATE)}
    >
      <Flex alignItems="center" height="100%">
        <Center
          mr="6"
          color="white"
          width="140px"
          rounded="35px"
          height="140px"
          fontSize="35px"
          backgroundSize="contain"
          backgroundImage={avatar}
          bgColor={!avatar ? createSpace.createSpaceDTO.color : ""}
        >
          {!avatar ? createSpace.createSpaceDTO.name[0].toUpperCase() : ""}
        </Center>

        <Box flexGrow="1" pl="6">
          <Flex
            height="20px"
            alignItems="center"
            justifyContent="space-between"
          >
            <Text
              opacity="50%"
              fontSize="12px"
              letterSpacing="wide"
              fontWeight="semibold"
            >
              SPACE COLOR
            </Text>

            <FileUploader
              name="file"
              multiple={false}
              types={fileTypes}
              handleChange={handleUploadImg}
            >
              <Center
                px="4"
                pt="2px"
                pb="3px"
                mr="30px"
                rounded="full"
                fontSize="13px"
                cursor="pointer"
                borderWidth="1px"
                color="purple.400"
                borderColor={borderColor}
                _hover={{ bgColor: "customBlue.200", color: "white" }}
              >
                + Upload
              </Center>
            </FileUploader>

            <EditAvatarModal
              updatedImg={avatar}
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onCancel={handleCancelEdit}
              originalImg={originalImgStr}
              onImgSelect={(imgOutput) =>
                setCreateSpace(
                  produce(createSpace, (draftState) => {
                    draftState.createSpaceDTO.avatar = imgOutput;
                  })
                )
              }
            />
          </Flex>

          {spaceColors2D.map((colorGroup, index) => (
            <Flex my="6" key={index}>
              {index === 0 && (
                <NotAllowedIcon
                  mx={mx}
                  rounded="4px"
                  width="15px"
                  height="15px"
                  cursor="pointer"
                  onClick={handleCancelColor}
                />
              )}

              {colorGroup.map((color, index) => (
                <Box
                  mx={mx}
                  key={index}
                  rounded="4px"
                  width="15px"
                  height="15px"
                  bgColor={color}
                  cursor="pointer"
                  onClick={() => handlePickColor(color)}
                ></Box>
              ))}
            </Flex>
          ))}
        </Box>
      </Flex>
    </CreateSpaceModalTemplate>
  );
}
