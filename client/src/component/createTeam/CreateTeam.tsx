import {
  Box,
  Center,
  Flex,
  Image,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useAuthContext from "../../context/auth/useAuthContext";
import { getRandomTeamColor } from "../../media/colors";
import pic from "../../media/onboardingImg.png";
import AvatarColor from "./AvatarColor";
import CreateTeamTemplate from "./CreateTeamTemplate";
import TeamSize from "./TeamSize";

type Props = {};

export type CreateTeamDTO = {
  name: string;
  color: string;
  avatar: string;
  memberEmails: string;
};

export default function CreateTeam({}: Props) {
  const { authState } = useAuthContext();
  const initTeam: CreateTeamDTO = {
    avatar: "",
    color: getRandomTeamColor(),
    name: `${authState.user?.username}'s Workspace`,
    memberEmails: "",
  };
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLDivElement[]>([]);
  const [team, setTeam] = useState<CreateTeamDTO>(initTeam);
  const color = useColorModeValue("darkMain.200", "lightMain.200");
  const bgColor = useColorModeValue("rgb(250, 251, 252)", "darkMain.300");

  useEffect(() => {
    if (ref.current.length) {
      ref.current[0].scrollIntoView({
        inline: "center",
        block: "center",
      });
    }
  }, []);

  function handleNextStage(stage: number) {
    setStep(stage);
    ref.current[stage]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "center",
    });
  }

  function setCurrentStep() {
    ref.current.forEach((element, index) => {
      const topPosition = element.getBoundingClientRect().top;
      if (50 < topPosition && topPosition < 450) {
        setStep(index);
      }
    });
  }

  return (
    <Flex height="100vh" color={color} bgColor={bgColor} position="relative">
      <Box
        pr="90px"
        pl="150px"
        flexGrow="1"
        width="100%"
        overflowY="auto"
        onScroll={setCurrentStep}
      >
        <Box height="200px" />

        {/* Name */}
        <Box ref={(element) => element && (ref.current[0] = element)}>
          <CreateTeamTemplate
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
          </CreateTeamTemplate>
        </Box>

        {/* Avatar and color */}
        <Box ref={(element) => element && (ref.current[1] = element)} mb="50px">
          <CreateTeamTemplate
            step={step}
            stageNumber={1}
            buttonTitle="I'm happy so far"
            handleNextStage={handleNextStage}
            title="Customize your Workspace's avatar:"
          >
            <AvatarColor
              team={team}
              step={step}
              setTeam={setTeam}
              handleNextStage={handleNextStage}
            />
          </CreateTeamTemplate>
        </Box>

        {/* TeamSize */}
        <Box ref={(element) => element && (ref.current[2] = element)}>
          <CreateTeamTemplate
            step={step}
            stageNumber={2}
            title="How many people will you be working with?"
          >
            <TeamSize
              step={step}
              setTeam={setTeam}
              handleNextStage={handleNextStage}
            />
          </CreateTeamTemplate>
        </Box>

        {/* Member email */}
        <Box ref={(element) => element && (ref.current[3] = element)}>
          <CreateTeamTemplate
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
              width="100%"
              display="block"
              fontSize="40px"
              variant="flushed"
              value={team.memberEmails}
              borderColor="customBlue.200"
              placeholder="Enter email addresses(or paste multiple)"
              onChange={(e) =>
                setTeam({ ...team, memberEmails: e.target.value })
              }
            />
          </CreateTeamTemplate>
        </Box>

        {/* Apps */}
        <Box ref={(element) => element && (ref.current[4] = element)}>
          <CreateTeamTemplate
            step={step}
            stageNumber={4}
            buttonTitle="No, thanks"
            handleNextStage={handleNextStage}
            title="Do you use any of these apps?"
          >
            <Box opacity="70%">(some icons and stuff...)</Box>
          </CreateTeamTemplate>
        </Box>

        {/* Import tasks */}
        <Box ref={(element) => element && (ref.current[5] = element)}>
          <CreateTeamTemplate
            step={step}
            stageNumber={5}
            buttonTitle="No, thanks"
            handleNextStage={handleNextStage}
            title="Do you want to import tasks?"
          >
            <Box opacity="70%">(some more icons and stuff...)</Box>
          </CreateTeamTemplate>
        </Box>

        {/* Done */}
        <Box ref={(element) => element && (ref.current[6] = element)} mb="65px">
          <CreateTeamTemplate
            step={step}
            stageNumber={6}
            createTeamDTO={team}
            buttonTitle="Play with ClickUp"
            title="That's it. Now go and change the world!"
          >
            <Box mt="-40px" fontSize="25px">
              And don't forget to have fun 🙌
            </Box>
          </CreateTeamTemplate>
        </Box>
      </Box>

      {/* Step Button */}
      <Box position="absolute" right="330px" bottom="20px">
        {step !== 0 && (
          <Center
            rounded="md"
            width="50px"
            color="white"
            height="50px"
            fontSize="2xl"
            cursor="pointer"
            bgColor="customBlue.200"
            _hover={{ bgColor: "customBlue.100" }}
            onClick={() => handleNextStage(step - 1)}
          >
            <i className="bi bi-chevron-up"></i>
          </Center>
        )}

        {step !== 6 && (
          <Center
            mt="3"
            rounded="md"
            width="50px"
            color="white"
            height="50px"
            fontSize="2xl"
            cursor="pointer"
            bgColor="customBlue.200"
            _hover={{ bgColor: "customBlue.100" }}
            onClick={() => handleNextStage(step + 1)}
          >
            <i className="bi bi-chevron-down"></i>
          </Center>
        )}
      </Box>

      <Box>
        <Image height="100vh" width="400px" src={pic} />
      </Box>
    </Flex>
  );
}
