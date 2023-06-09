import { Box, Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { memo, useState } from "react";
import { useLocation } from "react-router-dom";
import { CLIENT_ROUTE, IS_SUB_NAV_OPEN } from "../../constant";
import FixedNavBar from "./navbar/FixedNavBar";
import SubNavbar from "./subNavbar/SubNavbar";

type Props = {};

export default memo(NavBar);
function NavBar({}: Props) {
  const location = useLocation();
  const collapsibleBG = useColorModeValue("white", "rgb(26, 32, 44)");

  const isNavOpen = JSON.parse(localStorage.getItem(IS_SUB_NAV_OPEN) || "");
  const [isExpanded, setIsExpanded] = useState(isNavOpen);
  const { getDisclosureProps, isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: isNavOpen,
  });

  return (
    <Flex as="nav" onMouseOutCapture={isExpanded ? undefined : onClose}>
      {/* Fixed navbar */}
      <FixedNavBar
        onOpen={onOpen}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      {/* Sub navbar */}
      {location.pathname.includes(CLIENT_ROUTE.TASK_BOARD) && (
        <Box
          zIndex="2"
          left="55px"
          opacity="100%"
          onMouseOverCapture={onOpen}
          backgroundColor={collapsibleBG}
          position={isExpanded ? undefined : "absolute"}
        >
          <SubNavbar
            isOpen={isOpen}
            onClose={onClose}
            isExpanded={isExpanded}
            setIsExpanded={setIsExpanded}
            getDisclosureProps={getDisclosureProps}
          />
        </Box>
      )}
    </Flex>
  );
}
