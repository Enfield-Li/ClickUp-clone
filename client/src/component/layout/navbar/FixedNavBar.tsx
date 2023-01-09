import { Box, Center, Divider, Flex } from "@chakra-ui/react";
import { memo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../constant";
import LogoSVG from "../../../media/LogoSVG";
import { Section } from "../../../ApplicationEntry";
import NavIcon from "./NavIcon";
import ApplicationSettings from "./settings/ApplicationSettings";

type Props = {
  onOpen: () => void;
  isExpanded: boolean;
  fixedNavbarWidth: string;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(FixedNavBar);
function FixedNavBar({
  onOpen,
  isExpanded,
  setIsExpanded,
  fixedNavbarWidth,
}: Props) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  function handleOpenSubNavbar() {
    onOpen();
    setIsExpanded(true);
  }

  function handleGoHome() {
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
          {!isExpanded && pathname.includes(CLIENT_ROUTE.ON_BOARDING) && (
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
            <NavIcon name="Home" url={CLIENT_ROUTE.HOME}>
              {pathname.includes(CLIENT_ROUTE.HOME) ? (
                <i className="bi bi-house-door-fill"></i>
              ) : (
                <i className="bi bi-house-door"></i>
              )}
            </NavIcon>

            <NavIcon name="Search" url="not-found">
              <i className="bi bi-search"></i>
            </NavIcon>

            <NavIcon name="Task" url={CLIENT_ROUTE.TASK_BOARD}>
              {pathname.includes(CLIENT_ROUTE.TASK_BOARD) ? (
                <i className="bi bi-check-square-fill"></i>
              ) : (
                <i className="bi bi-check-square"></i>
              )}
            </NavIcon>

            <Box>
              <NavIcon name="Notifications" url="not-found">
                <i className="bi bi-bell"></i>
                {/* <i className="bi bi-bell-fill"></i> */}
              </NavIcon>
            </Box>

            <Box px="3" width="100%" my="3px">
              <Divider opacity="100%" borderColor="blackAlpha.600" />
            </Box>

            <Box>
              <NavIcon name="Dashboards" url="not-found">
                <i className="bi bi-grid-1x2"></i>
                {/* <i className="bi bi-grid-1x2-fill"></i> */}
              </NavIcon>
            </Box>

            {/* Dev test */}
            <NavIcon name="test" url={CLIENT_ROUTE.TEST_DEV}>
              {pathname.includes(CLIENT_ROUTE.TEST_DEV) ? (
                <i className="bi bi-question-circle-fill"></i>
              ) : (
                <i className="bi bi-question-circle"></i>
              )}
            </NavIcon>
          </Center>
        </Box>

        <Center flexDir="column">
          <Box>
            <NavIcon name="Docs" url="not-found">
              <i className="bi bi-file-earmark-text"></i>
              {/* <i className="bi bi-file-earmark-text-fill"></i> */}
            </NavIcon>
          </Box>

          <Box>
            <NavIcon name="Pulse" url="not-found">
              <i className="bi bi-broadcast"></i>
            </NavIcon>
          </Box>

          <Box>
            <NavIcon name="Goals" url="not-found">
              <i className="bi bi-trophy"></i>
              {/* <i className="bi bi-trophy-fill"></i> */}
            </NavIcon>
          </Box>

          <Box>
            <NavIcon name="Help" url="not-found">
              <i className="bi bi-question-lg"></i>
            </NavIcon>
          </Box>

          <Box>
            <NavIcon name="" url="not-found">
              <i className="bi bi-three-dots-vertical"></i>
            </NavIcon>
          </Box>

          <Divider borderColor="blackAlpha.500" mt="2" opacity="60%" />

          <Box mt="26px" mb="7px">
            <ApplicationSettings />
          </Box>
        </Center>
      </Flex>
    </Box>
  );
}
