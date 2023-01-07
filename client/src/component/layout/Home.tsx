import { Button, Center } from "@chakra-ui/react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { CLIENT_ROUTE } from "../../constant";

type Props = {};

export default memo(Home);
function Home({}: Props) {
  return (
    <Center textAlign="center" fontSize="xl" p={3} height="100vh">
      {/* <Button>
        <Link to={CLIENT_ROUTE.LOGIN}>login</Link>
      </Button> */}
      <Center>Under construction</Center>
    </Center>
  );
}
