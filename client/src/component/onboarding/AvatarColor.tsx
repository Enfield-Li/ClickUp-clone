import { Box, Center, Divider, Flex, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { teamColors2D } from "../../media/colors";
import EditAvatarModal from "./EditAvatar";
import { CreateTeamDTO } from "./CreateTeam";
import OnBoardingTemplate from "./OnBoardingTemplate";

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
  const [imgString, setImageString] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (imgString) {
      onOpen();
    }
  }, [imgString]);

  useEffect(() => {
    if (!isOpen) setImageString("");
  }, [isOpen]);

  async function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleChange(file: File) {
    setImageString(await toBase64(file));
  }

  return (
    <OnBoardingTemplate
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
          handleChange={handleChange}
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
          team={team}
          isOpen={isOpen}
          onClose={onClose}
          setTeam={setTeam}
          imgString={imgString}
        />

        <Flex flexDir="column" alignItems="center" mx="30px" opacity="40%">
          <Divider
            opacity="35%"
            borderColor="blackAlpha.600"
            orientation="vertical"
          />
          <Box py="3">or</Box>
          <Divider
            opacity="35%"
            borderColor="blackAlpha.600"
            orientation="vertical"
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
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="gray.400"
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
    </OnBoardingTemplate>
  );
}
