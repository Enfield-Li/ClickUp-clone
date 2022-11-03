import { Center, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../utils/constant";
import NavIcon from "./NavIcon";

type Props = {
  onOpen: () => void;
  isExpanded: boolean;
  fixedNavbarWidth: string;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FixedNavBar({
  onOpen,
  isExpanded,
  setIsExpanded,
  fixedNavbarWidth,
}: Props) {
  const navigate = useNavigate();

  function handleOpenSubNavbar() {
    onOpen();
    setIsExpanded(true);
  }

  return (
    <Box
      borderRight={"1px"}
      borderColor={"teal.300"}
      width={fixedNavbarWidth}
      onMouseOverCapture={onOpen}
    >
      {/* Expand icon -- absolute position */}
      {!isExpanded && (
        <Center cursor="pointer" onClick={handleOpenSubNavbar}>
          <Center
            mt="76px"
            width="20px"
            height="20px"
            color="white"
            zIndex="3"
            rounded="full"
            fontSize="10px"
            position="absolute"
            ml={fixedNavbarWidth}
            backgroundColor="rgb(91, 67, 234)"
          >
            <i className="bi bi-chevron-right"></i>
          </Center>
        </Center>
      )}

      <Center
        mt={4}
        fontSize="lg"
        cursor="pointer"
        onClick={() => navigate(CLIENT_ROUTE.HOME)}
      >
        <i className="bi bi-lightbulb-fill"></i>
      </Center>

      <Box mt={6}>
        <NavIcon url={CLIENT_ROUTE.TASK} name="Task">
          <i className="bi bi-check-square-fill"></i>
        </NavIcon>

        <NavIcon url={CLIENT_ROUTE.FUNC_TWO} name="test">
          <i className="bi bi-question-circle"></i>
        </NavIcon>
      </Box>
    </Box>
  );
}
