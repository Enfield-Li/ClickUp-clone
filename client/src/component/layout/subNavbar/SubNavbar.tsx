import {
  Box,
  Center,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CLIENT_ROUTE, IS_SUB_NAV_OPEN } from "../../../constant";
import { useTeam } from "../../../context/team/useTeam";
import useInitSpaceList from "../../../hook/useInitSpaceList";
import SubNavbarContent from "./SubNavbarContent";

type Props = {
  isOpen: boolean;
  isExpanded: boolean;
  onClose: () => void;
  getDisclosureProps: (props?: any) => any;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export default memo(SubNavbar);
function SubNavbar({
  isOpen,
  onClose,
  isExpanded,
  setIsExpanded,
  getDisclosureProps,
}: Props) {
  useInitSpaceList();
  const navigate = useNavigate();
  const { teamsForRender } = useTeam();
  const [hidden, setHidden] = useState(!isOpen);
  const currentTeam = teamsForRender.find((team) => team.isSelected);

  const subNavWidth = "250px";
  const collapseIcon = useColorModeValue("white", "darkMain.200");
  const subNavBGColor = useColorModeValue("darkMain.400", "darkMain.200");
  const collapseIconBorder = useColorModeValue("gray.300", "darkMain.300");
  const collapseIconArrow = useColorModeValue("darkMain.300", "lightMain.100");

  function handleCloseSubNavbar() {
    onClose();
    setIsExpanded(false);
    localStorage.setItem(IS_SUB_NAV_OPEN, JSON.stringify(false));
  }

  return (
    // https://chakra-ui.com/community/recipes/horizontal-collapse
    <motion.div
      {...getDisclosureProps()}
      hidden={hidden}
      initial={false}
      transition="none"
      onAnimationStart={() => setHidden(false)}
      animate={{ width: isOpen ? subNavWidth : 0 }}
      onAnimationComplete={() => setHidden(!isOpen)}
      style={{ overflow: !isExpanded ? "hidden" : "", whiteSpace: "nowrap" }}
    >
      <Box
        height="100vh"
        borderRightWidth="1px"
        borderColor="darkMain.400"
        backgroundColor={subNavBGColor}
      >
        {/* Close icon */}
        {isExpanded && (
          <Center cursor="pointer" onClick={handleCloseSubNavbar}>
            <Center
              zIndex="3"
              pr="1.5px"
              mt="123px"
              ml={subNavWidth}
              border="1px"
              width="20px"
              height="20px"
              rounded="full"
              fontSize="11px"
              position="absolute"
              color={collapseIconArrow}
              backgroundColor={collapseIcon}
              borderColor={collapseIconBorder}
            >
              <i className="bi bi-chevron-left"></i>
            </Center>
          </Center>
        )}

        <Flex>
          {/* App icon */}
          <Center py={3}>
            <Heading size="md" px={5}>
              <Box cursor="pointer" onClick={() => navigate(CLIENT_ROUTE.HOME)}>
                Ideas
              </Box>
            </Heading>
          </Center>
        </Flex>

        {/* Content */}
        <SubNavbarContent currentTeam={currentTeam} />
      </Box>
    </motion.div>
  );
}
