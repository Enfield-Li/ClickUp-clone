import { Center, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../utils/constant";

type Props = {
  isExpanded: boolean;
  onOpen: () => void;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function FixedNavBar({
  isExpanded,
  onOpen,
  setIsExpanded,
}: Props) {
  const navigate = useNavigate();

  return (
    <Box width="45px" borderRight={"1px"} borderColor={"teal.300"}>
      <Center
        mt={4}
        fontSize="lg"
        cursor="pointer"
        onClick={() => navigate(CLIENT_ROUTE.HOME)}
      >
        <i className="bi bi-lightbulb-fill"></i>
      </Center>

      {/* Expand icon -- absolute position */}
      {!isExpanded && (
        <Center
          cursor="pointer"
          onClick={() => {
            onOpen();
            setIsExpanded(true);
          }}
        >
          <Center
            ml="45px"
            mt="70px"
            zIndex="99"
            width="20px"
            height="20px"
            color="white"
            rounded="full"
            fontSize="10px"
            position="absolute"
            backgroundColor="rgb(91, 67, 234)"
          >
            <i className="bi bi-chevron-right"></i>
          </Center>
        </Center>
      )}
    </Box>
  );
}
