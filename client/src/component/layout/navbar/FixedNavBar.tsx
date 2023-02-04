import { Box, Center, Divider, Flex, Image } from "@chakra-ui/react";
import { memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../constant";
import useTeamStateContext from "../../../context/team/useTeamContext";
import { logoDataUrl } from "../../../media/imgDataUrl";
import { getTaskBoardURL } from "../../../utils/getTaskBoardURL";
import NavIcon from "./NavIcon";
import ApplicationSettings from "./settings/ApplicationSettings";

type Props = {
  onOpen: () => void;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(FixedNavBar);
function FixedNavBar({ onOpen, isExpanded, setIsExpanded }: Props) {
  const fixedNavbarWidth = "55px";
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
          <NavLink
            to={CLIENT_ROUTE.TASK_BOARD}
            onClick={(e) => e.preventDefault()}
          >
            {({ isActive }) =>
              !isExpanded &&
              isActive && (
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
              )
            }
          </NavLink>

          {/* Logo */}
          <Center cursor="pointer" onClick={() => navigate(CLIENT_ROUTE.HOME)}>
            <Image height="30px" mt="3" src={logoDataUrl} />
          </Center>

          {/* Task icon */}
          <Center flexDir="column" mt={3}>
            <NavIcon name="Home" url={CLIENT_ROUTE.HOME}>
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <i className="bi bi-house-door-fill"></i>
                  ) : (
                    <i className="bi bi-house-door"></i>
                  )}
                </>
              )}
            </NavIcon>

            <NavIcon name="Search" url={CLIENT_ROUTE.SEARCH}>
              {({ isActive }) => <i className="bi bi-search"></i>}
            </NavIcon>

            <NavIcon name="Task" url={CLIENT_ROUTE.TASK_BOARD}>
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <i className="bi bi-check-square-fill"></i>
                  ) : (
                    <i className="bi bi-check-square"></i>
                  )}
                </>
              )}
            </NavIcon>

            <NavIcon name="Notifications" url={CLIENT_ROUTE.NOTIFICATIONS}>
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <i className="bi bi-bell-fill"></i>
                  ) : (
                    <i className="bi bi-bell"></i>
                  )}
                </>
              )}
            </NavIcon>

            <Box px="3" width="100%" my="3px">
              <Divider opacity="100%" borderColor="blackAlpha.600" />
            </Box>

            <NavIcon name="Dashboards" url={CLIENT_ROUTE.DASHBOARDS}>
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <i className="bi bi-grid-1x2-fill"></i>
                  ) : (
                    <i className="bi bi-grid-1x2"></i>
                  )}
                </>
              )}
            </NavIcon>

            {/* Dev test */}
            <NavIcon name="test" url={CLIENT_ROUTE.TEST_DEV}>
              {({ isActive }) => (
                <>
                  {isActive ? (
                    <i className="bi bi-question-circle-fill"></i>
                  ) : (
                    <i className="bi bi-question-circle"></i>
                  )}
                </>
              )}
            </NavIcon>
          </Center>
        </Box>

        <Center flexDir="column">
          <NavIcon name="Docs" url={CLIENT_ROUTE.DOCS}>
            {({ isActive }) => (
              <>
                {isActive ? (
                  <i className="bi bi-file-earmark-text-fill"></i>
                ) : (
                  <i className="bi bi-file-earmark-text"></i>
                )}
              </>
            )}
          </NavIcon>

          <NavIcon name="Pulse" url={CLIENT_ROUTE.PULSE}>
            {({ isActive }) => (
              <>
                {isActive ? (
                  <i className="bi bi-broadcast-pin"></i>
                ) : (
                  <i className="bi bi-broadcast"></i>
                )}
              </>
            )}
          </NavIcon>

          <NavIcon name="Goals" url={CLIENT_ROUTE.GOALS}>
            {({ isActive }) => (
              <>
                {isActive ? (
                  <i className="bi bi-trophy-fill"></i>
                ) : (
                  <i className="bi bi-trophy"></i>
                )}
              </>
            )}
          </NavIcon>

          <NavIcon name="Help" url={CLIENT_ROUTE.HELP}>
            {({ isActive }) => <i className="bi bi-question-lg"></i>}
          </NavIcon>

          <NavIcon name="" url={CLIENT_ROUTE.OPTIONS}>
            {({ isActive }) => <i className="bi bi-three-dots-vertical"></i>}
          </NavIcon>

          <Divider borderColor="blackAlpha.500" mt="2" opacity="60%" />

          <Box mt="26px" mb="7px">
            <ApplicationSettings />
          </Box>
        </Center>
      </Flex>
    </Box>
  );
}
