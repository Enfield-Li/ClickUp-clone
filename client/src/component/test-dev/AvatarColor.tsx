import { Box, Center, Divider, Flex } from "@chakra-ui/react";
import { FileUploader } from "react-drag-drop-files";
import { teamColors2D } from "../../media/colors";
import { InitTeam } from "./MultiStepForm";
import OnBoardingTemplate from "./OnBoardingTemplate";

type Props = {
  team: InitTeam;
  step: number;
  handleNextStage(stage: number): void;
  setTeam: React.Dispatch<React.SetStateAction<InitTeam>>;
};

export default function AvatarColor({
  step,
  team,
  setTeam,
  handleNextStage,
}: Props) {
  const fileTypes = ["JPEG", "PNG", "GIF"];
  function handleChange() {}

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
          bgColor={team.color}
          borderStyle="dashed"
          borderColor="gray.400"
        >
          {team.name[0].toUpperCase()}
        </Center>

        <Box ml="6" mt="6">
          {teamColors2D.map((colors, index) => (
            <Flex key={index} mb={index !== 2 ? "40px" : ""}>
              {colors.map((color, index) => (
                <Box
                  mx="6"
                  width="20px"
                  height="20px"
                  rounded="full"
                  bgColor={color}
                  cursor="pointer"
                  onClick={() => setTeam({ ...team, color })}
                ></Box>
              ))}
            </Flex>
          ))}
        </Box>
      </Flex>
    </OnBoardingTemplate>
  );
}
