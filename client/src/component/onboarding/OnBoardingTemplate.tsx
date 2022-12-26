import { Flex, Center, Box, Button } from "@chakra-ui/react";
import React from "react";
import { API_ENDPOINT } from "../../constant";
import LogoSVG from "../../media/LogoSVG";
import { axiosTeamServiceInstance } from "../../utils/AxiosInterceptor";
import { CreateTeamDTO } from "./CreateTeam";

type Props = {
  step: number;
  title: string;
  stageNumber: number;
  buttonTitle?: string;
  createTeamDTO?: CreateTeamDTO;
  children: React.ReactNode;
  handleNextStage?: (stage: number) => void;
};

export default function OnBoardingTemplate({
  step,
  title,
  children,
  stageNumber,
  buttonTitle,
  createTeamDTO,
  handleNextStage,
}: Props) {
  async function createTeam() {
    if (createTeamDTO) {
      const response = await axiosTeamServiceInstance.post<boolean>(
        API_ENDPOINT.TEAM,
        createTeamDTO
      );
      // TODO: redirect after click button
      console.log(response);
    }
  }

  function handleClickButton() {
    if (handleNextStage) {
      handleNextStage(stageNumber + 1);
      return;
    }
    if (buttonTitle === "Play with ClickUp") {
      createTeam();
    }
  }

  return (
    <Box height="410px" opacity={step === stageNumber ? "" : "25%"}>
      <Flex>
        <Center
          mr="6"
          shadow="lg"
          width="58px"
          height="58px"
          rounded="full"
          boxShadow="lg"
          bgColor="white"
        >
          <Center
            width="fit-content"
            height="fit-content"
            transform="scale(0.25)"
          >
            <LogoSVG />
          </Center>
        </Center>

        <Box flexGrow="1">
          <Box mt="2" fontSize="25px">
            {title}
          </Box>

          <Box mt="40px">{children}</Box>

          {buttonTitle && (
            <Button
              mt="50px"
              size="lg"
              _focus={{}}
              _active={{}}
              rounded="md"
              color="white"
              bgColor="customBlue.200"
              onClick={handleClickButton}
              _hover={{ bgColor: "customBlue.100" }}
            >
              {buttonTitle}
            </Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
}
