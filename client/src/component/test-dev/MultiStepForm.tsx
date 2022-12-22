import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import useAuthContext from "../../context/auth/useAuthContext";
import { getRandomTeamColor, teamColors2D } from "../../media/colors";
import pic from "../../media/onboarding.png";
import { Team } from "../../types";
import AvatarColor from "./AvatarColor";
import OnBoardingTemplate from "./OnBoardingTemplate";
import TeamSize from "./TeamSize";

type Props = {};

export type InitTeam = Team & { memberEmails: string };

export default function MultiStepForm({}: Props) {
  const { authState } = useAuthContext();
  const initTeam: Team & { memberEmails: string } = {
    color: "rgb(64, 188, 134)",
    isPrivate: false,
    member: [],
    name: `${authState.user?.username}'s Workspace`,
    spaceList: [],
    memberEmails: "",
  };
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement[]>([]);
  const [team, setTeam] = useState<InitTeam>(initTeam);
  const bgColor = useColorModeValue("rgb(250, 251, 252)", "lightMain.200");
  const fileTypes = ["JPEG", "PNG", "GIF"];

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

  function handleChange() {}

  return (
    <Flex bgColor={bgColor} height="100vh" color="darkMain.200">
      <Box flexGrow="1" overflowY="auto" px="150px" width="100%">
        <Box height="200px"></Box>

        {/* Name */}
        <Box ref={(el) => el && (ref.current[0] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={0}
            buttonTitle="Next"
            title="Name your Workspace:"
            handleNextStage={handleNextStage}
          >
            <Input
              pb="3"
              mt="30px"
              size="lg"
              autoFocus
              width="100%"
              display="block"
              fontSize="40px"
              variant="flushed"
              value={team.name}
              borderColor="customBlue.200"
              onChange={(e) => setTeam({ ...team, name: e.target.value })}
            />

            <Box color="customBlue.200" mt="4" fontSize="sm">
              You can also use the name of your company or organization
            </Box>
          </OnBoardingTemplate>
        </Box>

        {/* Avatar and color */}
        <Box ref={(el) => el && (ref.current[1] = el)}>
          <AvatarColor
            team={team}
            step={step}
            setTeam={setTeam}
            handleNextStage={handleNextStage}
          />
        </Box>

        <Box ref={(el) => el && (ref.current[2] = el)}>
          <TeamSize
            step={step}
            setTeam={setTeam}
            handleNextStage={handleNextStage}
          />
        </Box>

        <Box ref={(el) => el && (ref.current[3] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={3}
            buttonTitle="I'm done"
            title="Invite people to your Workspace:"
            handleNextStage={handleNextStage}
          >
            <Input
              pb="3"
              mt="30px"
              size="lg"
              autoFocus
              width="100%"
              display="block"
              fontSize="40px"
              variant="flushed"
              value={team.memberEmails}
              borderColor="customBlue.200"
              placeholder="Enter email addresses(or paste multiple)"
              _placeholder={{ color: "gray.800", fontSize: "30px" }}
              onChange={(e) =>
                setTeam({ ...team, memberEmails: e.target.value })
              }
            />
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[4] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={4}
            title="Do you use any of these apps?"
            buttonTitle="No, thanks"
            handleNextStage={handleNextStage}
          >
            <Box opacity="70%">(some icons and stuff...)</Box>
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[5] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={5}
            title="Do you want to import tasks?"
            buttonTitle="No, thanks"
            handleNextStage={handleNextStage}
          >
            <Box opacity="70%">(some more icons and stuff...)</Box>
          </OnBoardingTemplate>
        </Box>

        <Box ref={(el) => el && (ref.current[6] = el)}>
          <OnBoardingTemplate
            step={step}
            stageNumber={6}
            buttonTitle="Play with ClickUp"
            title="That's it. Now go and change the world!"
          >
            <Box mt="-40px" fontSize="25px">
              And don't forget to have fun 🙌
            </Box>
          </OnBoardingTemplate>
        </Box>
      </Box>

      <Box>
        <img style={{ height: "100vh", width: "400px" }} src={pic} />
      </Box>
    </Flex>
  );
}
