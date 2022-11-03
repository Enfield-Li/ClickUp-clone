import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE } from "../../../utils/constant";
import SubNavbar from "./SubNavbar";

type Props = {
  isOpen: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  getDisclosureProps: (props?: any) => any;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectable: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ToggleNavBar({
  isOpen,
  onToggle,
  isExpanded,
  setIsExpanded,
  setSelectable,
  getDisclosureProps,
}: Props) {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(!isOpen);

  const collapseIcon = useColorModeValue("white", "rgb(43, 52, 59)");
  const subNavBGColor = useColorModeValue("rgb(32, 38, 43)", "rgb(43, 52, 59)");
  const collapseIconBorder = useColorModeValue("gray.300", "rgb(30, 39, 46)");

  function handleCloseSubNavbar() {
    onToggle();
    setIsExpanded(false);
    setSelectable(false);

    // Prevent Collapsible from opening after closing
    setTimeout(() => setSelectable(true), 350);
  }

  return (
    // https://chakra-ui.com/community/recipes/horizontal-collapse
    <motion.div
      {...getDisclosureProps()}
      hidden={hidden}
      initial={false}
      transition={"none"}
      animate={{ width: isOpen ? 200 : 0 }}
      onAnimationStart={() => setHidden(false)}
      onAnimationComplete={() => setHidden(!isOpen)}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        height="100vh"
        borderRightWidth="1px"
        borderColor="rgb(32, 38, 43)"
        backgroundColor={subNavBGColor}
      >
        {isExpanded && (
          <Center cursor="pointer" onClick={handleCloseSubNavbar}>
            <Center
              zIndex="3"
              mt="128px"
              ml="200px"
              border="1px"
              width="20px"
              height="20px"
              rounded="full"
              fontSize="10px"
              color="gray.400"
              position="absolute"
              backgroundColor={collapseIcon}
              borderColor={collapseIconBorder}
            >
              <i className="bi bi-chevron-left"></i>
            </Center>
          </Center>
        )}

        <Flex my={1}>
          {/* App icon */}
          <Center py={3}>
            <Heading size="md" px={5}>
              <Box
                cursor={"pointer"}
                onClick={() => navigate(CLIENT_ROUTE.HOME)}
              >
                Ideas
              </Box>
            </Heading>
          </Center>
        </Flex>

        {/* Content */}
        <SubNavbar />
      </Box>
    </motion.div>
  );
}
