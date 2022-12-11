import {
  Box,
  Center,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../constant";
import LogoSVG from "../../../media/LogoSVG";
import { Section } from "../../../routes/ApplicationEntry";
import AccountSettings from "./settings/AccountSettings";
import NavIcon from "./NavIcon";
import ApplicationSettings from "./settings/ApplicationSettings";

type Props = {
  onOpen: () => void;
  isExpanded: boolean;
  currentSection: Section;
  fixedNavbarWidth: string;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSection: React.Dispatch<React.SetStateAction<Section>>;
};

export default memo(FixedNavBar);
function FixedNavBar({
  onOpen,
  isExpanded,
  setIsExpanded,
  currentSection,
  fixedNavbarWidth,
  setCurrentSection,
}: Props) {
  const navigate = useNavigate();

  function handleOpenSubNavbar() {
    onOpen();
    setIsExpanded(true);
  }

  return (
    <Box
      height="100%"
      borderRightWidth="1px"
      width={fixedNavbarWidth}
      onMouseOverCapture={onOpen}
      borderRightColor="darkMain.400"
    >
      <Flex flexDir="column" height="100%" justifyContent="space-between">
        <Box>
          {/* Expand icon -- absolute position */}
          {!isExpanded && currentSection === Section.TASKS && (
            <Center cursor="pointer" onClick={handleOpenSubNavbar}>
              <Center
                mt="76px"
                zIndex="3"
                width="18px"
                height="18px"
                color="white"
                rounded="full"
                fontSize="10px"
                position="absolute"
                ml={fixedNavbarWidth}
                backgroundColor="customBlue.200"
                _hover={{ backgroundColor: "customBlue.100" }}
              >
                <i className="bi bi-chevron-right"></i>
              </Center>
            </Center>
          )}

          {/* Logo */}
          <Center
            mt="26px"
            ml="23px"
            boxSize="10px"
            role="menuitem"
            aria-label="logo"
            cursor="pointer"
            onClick={() => {
              setCurrentSection(Section.HOME);
              navigate(CLIENT_ROUTE.HOME);
            }}
          >
            <Center
              width="fit-content"
              height="fit-content"
              transform="scale(0.2)"
            >
              <LogoSVG />
            </Center>
          </Center>

          {/* Task icon */}
          <Box mt={6}>
            <Box onClick={() => setCurrentSection(Section.TASKS)}>
              <NavIcon
                name="Task"
                url={CLIENT_ROUTE.TASK_BOARD}
                isSelected={currentSection === Section.TASKS}
              >
                {currentSection === Section.TASKS ? (
                  <i className="bi bi-check-square-fill"></i>
                ) : (
                  <i className="bi bi-check-square"></i>
                )}
              </NavIcon>
            </Box>

            {/* Dev test */}
            <Box onClick={() => setCurrentSection(Section.DEV)}>
              <NavIcon
                name="test"
                url={CLIENT_ROUTE.TEST_DEV}
                isSelected={currentSection === Section.DEV}
              >
                {currentSection === Section.DEV ? (
                  <i className="bi bi-question-circle-fill"></i>
                ) : (
                  <i className="bi bi-question-circle"></i>
                )}
              </NavIcon>
            </Box>
          </Box>
        </Box>

        <Center mb="3">
          <ApplicationSettings />
        </Center>
      </Flex>
    </Box>
  );
}
