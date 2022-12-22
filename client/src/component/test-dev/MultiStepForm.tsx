import { Box, Flex, Input, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import pic from "../../media/onboarding.png";
import { Team } from "../../types";
import OnBoardingTemplate from "./OnBoardingTemplate";

type Props = {};
const initTeam: Team = {
  color: "",
  isPrivate: false,
  member: [],
  name: "",
  spaceList: [],
};

export default function MultiStepForm({}: Props) {
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement[]>([]);
  const [team, setTeam] = useState<Team>(initTeam);
  const bgColor = useColorModeValue("rgb(250, 251, 252)", "lightMain.200");

  //   useEffect(() => {
  //     if (!isVisible(ref.current[ref.current]))
  //       ref.current[ref.current]?.scrollIntoView({
  //         behavior: "smooth",
  //         inline: "center",
  //         block: "center",
  //       });
  //   }, [ref]);

  //   function isVisible(element: HTMLDivElement): boolean {
  //     const { top, bottom } = element.getBoundingClientRect();
  //     const vHeight = window.innerHeight || document.documentElement.clientHeight;
  //     return (top > 0 || bottom > 0) && top < vHeight;
  //   }

  function handleNextStage(stage: number) {
    setStep(stage);
    ref.current[stage]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  }

  return (
    <Flex bgColor={bgColor} height="100vh">
      <Box flexGrow="1" overflowY="auto" px="150px" width="100%">
        <Box height="200px"></Box>

        <Box ref={(el) => el && (ref.current[0] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={0}
            title="Name your Workspace:"
          >
            <Input variant="flushed" width="100%" autoFocus display="block" />
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[1] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={1}
            title="Customize your Workspace's avatar:"
          >
            111
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[2] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={2}
            title="How many people will you be working with?"
          >
            222
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[3] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={3}
            title="Invite people to your Workspace:"
          >
            333
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[4] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={4}
            title="Do you use any of these apps?"
          >
            444
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[5] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={5}
            title="Do you want to import tasks?"
          >
            555
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[6] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={6}
            title="That's it. Now go and change the world!
            And don't forget to have fun"
          >
            666
          </OnBoardingTemplate>
        </Box>
      </Box>

      <Box>
        <img style={{ height: "100vh", width: "400px" }} src={pic} />
      </Box>
    </Flex>
  );
}
