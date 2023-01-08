import { Box, Center, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { teamColors2D } from "../../media/colors";
import EditAvatarModal from "./EditAvatar";
import { CreateTeamDTO } from "./CreateTeam";
import CreateTeamTemplate from "./CreateTeamTemplate";
import { imgFileToBase64String } from "../../utils/imgFileToBase64String";

type Props = {
  team: CreateTeamDTO;
  step: number;
  handleNextStage(stage: number): void;
  setTeam: React.Dispatch<React.SetStateAction<CreateTeamDTO>>;
};

export default function AvatarColor({
  step,
  team,
  setTeam,
  handleNextStage,
}: Props) {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  const [originalImgStr, setOriginalImgStr] = useState("");
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  async function handleUploadImg(file: File) {
    onModalOpen();
    setOriginalImgStr(await imgFileToBase64String(file));
  }

  function handleCloseModal() {
    onModalClose();
    setOriginalImgStr("");
  }

  function handleCancelEdit() {
    setOriginalImgStr("");
    setTeam({ ...team, avatar: "" });
  }

  return (
    <CreateTeamTemplate
      step={step}
      stageNumber={1}
      buttonTitle="I'm happy so far"
      handleNextStage={handleNextStage}
      title="Customize your Workspace's avatar:"
    >
      <Flex>
        <FileUploader
          name="file"
          multiple={false}
          types={fileTypes}
          handleChange={handleUploadImg}
        >
          <Center
            width="140px"
            height="140px"
            rounded="full"
            cursor="pointer"
            flexDir="column"
            borderWidth="1px"
            borderColor="gray.400"
            borderStyle={!team.avatar ? "dashed" : ""}
          >
            <Box opacity="35%" fontSize="lg">
              <i className="bi bi-cloud-upload"></i>
            </Box>

            <Center>Drop an image</Center>
            <Center>
              or
              <span>&nbsp;</span>
              <Box color="blue"> browse</Box>
            </Center>
          </Center>
        </FileUploader>

        <EditAvatarModal
          isOpen={isModalOpen}
          updatedImg={team.avatar}
          onClose={handleCloseModal}
          onCancel={handleCancelEdit}
          originalImg={originalImgStr}
          onImgSelect={(imgOutput) => setTeam({ ...team, avatar: imgOutput })}
        />

        <Flex flexDir="column" alignItems="center" mx="30px" opacity="40%">
          <Divider
            opacity="35%"
            orientation="vertical"
            borderColor="blackAlpha.600"
          />
          <Box py="3">or</Box>
          <Divider
            opacity="35%"
            orientation="vertical"
            borderColor="blackAlpha.600"
          />
        </Flex>

        <Center
          color="white"
          width="140px"
          height="140px"
          rounded="full"
          fontSize="30px"
          flexDir="column"
          fontWeight="bold"
          backgroundSize="contain"
          backgroundImage={team.avatar}
          bgColor={!team.avatar ? team.color : ""}
        >
          {!team.avatar && team.name[0].toUpperCase()}
        </Center>

        <Box ml="6" mt="6">
          {teamColors2D.map((colors, index) => (
            <Flex key={index} mb={index !== 2 ? "40px" : ""}>
              {colors.map((color, index) => (
                <Box
                  mx="6"
                  key={index}
                  width="20px"
                  height="20px"
                  rounded="full"
                  bgColor={color}
                  cursor="pointer"
                  onClick={() => setTeam({ ...team, color, avatar: "" })}
                ></Box>
              ))}
            </Flex>
          ))}
        </Box>
      </Flex>
    </CreateTeamTemplate>
  );
}
