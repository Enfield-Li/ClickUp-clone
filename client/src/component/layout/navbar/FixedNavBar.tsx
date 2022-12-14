import {
  Box,
  Center,
  Divider,
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
  selectedSection: Section;
  fixedNavbarWidth: string;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedSection: React.Dispatch<React.SetStateAction<Section>>;
};

export default memo(FixedNavBar);
function FixedNavBar({
  onOpen,
  isExpanded,
  setIsExpanded,
  selectedSection,
  fixedNavbarWidth,
  setSelectedSection,
}: Props) {
  const navigate = useNavigate();

  function handleOpenSubNavbar() {
    onOpen();
    setIsExpanded(true);
  }

  function handleGoHome() {
    setSelectedSection(Section.HOME);
    navigate(CLIENT_ROUTE.HOME);
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
          {!isExpanded && selectedSection === Section.TASKS && (
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
            mt="22px"
            ml="22px"
            boxSize="10px"
            role="menuitem"
            cursor="pointer"
            aria-label="logo"
            onClick={handleGoHome}
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
          <Center flexDir="column" mt={6}>
            <Box onClick={() => setSelectedSection(Section.HOME)}>
              <NavIcon
                name="Home"
                url={CLIENT_ROUTE.HOME}
                isSelected={selectedSection === Section.HOME}
              >
                {selectedSection === Section.HOME ? (
                  <i className="bi bi-house-door-fill"></i>
                ) : (
                  <i className="bi bi-house-door"></i>
                )}
              </NavIcon>
            </Box>

            <Box>
              <NavIcon name="Search">
                <i className="bi bi-search"></i>
              </NavIcon>
            </Box>

            <Box onClick={() => setSelectedSection(Section.TASKS)}>
              <NavIcon
                name="Task"
                url={CLIENT_ROUTE.TASK_BOARD}
                isSelected={selectedSection === Section.TASKS}
              >
                {selectedSection === Section.TASKS ? (
                  <i className="bi bi-check-square-fill"></i>
                ) : (
                  <i className="bi bi-check-square"></i>
                )}
              </NavIcon>
            </Box>

            <Box>
              <NavIcon name="Notifications">
                <i className="bi bi-bell"></i>
                {/* <i className="bi bi-bell-fill"></i> */}
              </NavIcon>
            </Box>

            <Box px="3" width="100%" my="3px">
              <Divider opacity="100%" borderColor="blackAlpha.600" />
            </Box>

            <Box>
              <NavIcon>
                <i className="bi bi-grid-1x2"></i>
                {/* <i className="bi bi-grid-1x2-fill"></i> */}
              </NavIcon>
            </Box>

            {/* Dev test */}
            <Box onClick={() => setSelectedSection(Section.DEV)}>
              <NavIcon
                name="test"
                url={CLIENT_ROUTE.TEST_DEV}
                isSelected={selectedSection === Section.DEV}
              >
                {selectedSection === Section.DEV ? (
                  <i className="bi bi-question-circle-fill"></i>
                ) : (
                  <i className="bi bi-question-circle"></i>
                )}
              </NavIcon>
            </Box>
          </Center>
        </Box>

        <Center flexDir="column">
          <Box>
            <NavIcon>
              <i className="bi bi-file-earmark-text"></i>
              {/* <i className="bi bi-file-earmark-text-fill"></i> */}
            </NavIcon>
          </Box>

          <Box>
            <NavIcon>
              <i className="bi bi-broadcast"></i>
            </NavIcon>
          </Box>

          <Box>
            <NavIcon>
              <i className="bi bi-trophy"></i>
              {/* <i className="bi bi-trophy-fill"></i> */}
            </NavIcon>
          </Box>

          <Box>
            <NavIcon>
              <i className="bi bi-question-lg"></i>
            </NavIcon>
          </Box>

          <Box>
            <NavIcon>
              <i className="bi bi-three-dots-vertical"></i>
            </NavIcon>
          </Box>

          <Divider borderColor="blackAlpha.500" mt="2" opacity="60%" />

          <Box mt="6" mb="3">
            <ApplicationSettings />
          </Box>
        </Center>
      </Flex>
    </Box>
  );
}
