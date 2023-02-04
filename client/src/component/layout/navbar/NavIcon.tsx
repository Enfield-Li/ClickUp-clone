import { Center, Tooltip } from "@chakra-ui/react";
import { memo, ReactElement } from "react";
import { NavLink } from "react-router-dom";

type Props = {
  url: string;
  name: string;
  children: (ctx: { isActive: boolean }) => ReactElement;
};

export default memo(NavIcon);
function NavIcon({ url, name, children }: Props) {
  return (
    <NavLink to={url}>
      {({ isActive }) => (
        <Tooltip
          ml={0}
          px={4}
          pb={1}
          hasArrow
          label={name}
          arrowSize={7}
          rounded="3px"
          role="tooltip"
          fontSize="12px"
          placement="right"
          fontWeight="bold"
        >
          <Center my="3px">
            <Center
              p="2"
              width="35px"
              height="35px"
              rounded="3px"
              role="menuitem"
              fontSize="16.5px"
              aria-label={name}
              opacity={name !== "Task" ? "40%" : undefined}
              bgColor={isActive ? "customBlue.200" : undefined}
              cursor={url !== "not-found" ? "pointer" : "not-allowed"}
              _hover={{ bgColor: isActive ? undefined : "darkMain.300" }}
            >
              {children({ isActive })}
            </Center>
          </Center>
        </Tooltip>
      )}
    </NavLink>
  );
}
