import { Center, Box } from "@chakra-ui/react";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../utils/constant";
import { Section } from "../NavBar";
import NavIcon from "./NavIcon";

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
      borderRightWidth="1px"
      width={fixedNavbarWidth}
      onMouseOverCapture={onOpen}
      borderRightColor="darkMain.400"
    >
      {/* Expand icon -- absolute position */}
      {!isExpanded && currentSection === "tasks" && (
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
        mt={4}
        fontSize="lg"
        role="menuitem"
        aria-label="logo"
        cursor="pointer"
        onClick={() => {
          setCurrentSection("home");
          navigate(CLIENT_ROUTE.HOME);
        }}
      >
        <i className="bi bi-lightbulb-fill"></i>
      </Center>

      {/* Task icon */}
      <Box mt={6}>
        <Box onClick={() => setCurrentSection("tasks")}>
          <NavIcon
            name="Task"
            url={CLIENT_ROUTE.TASK}
            isSelected={currentSection === "tasks"}
          >
            <i className="bi bi-check-square-fill"></i>
          </NavIcon>
        </Box>

        {/* Dev test */}
        <Box onClick={() => setCurrentSection("dev")}>
          <NavIcon
            name="test"
            url={CLIENT_ROUTE.TEST_DEV}
            isSelected={currentSection === "dev"}
          >
            <i className="bi bi-question-circle"></i>
          </NavIcon>
        </Box>
      </Box>
    </Box>
  );
}
