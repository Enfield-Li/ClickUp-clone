import { Center, Image } from "@chakra-ui/react";
import { loadingCircleDataUrl, logoDataUrl } from "../../media/imgDataUrl";

type Props = {};

export default function LoadingSpinner({}: Props) {
  return (
    <Center height="100vh">
      <Image src={loadingCircleDataUrl} />

      <Center position="absolute">
        <Image height="100px" src={logoDataUrl} />
      </Center>
    </Center>
  );
}
