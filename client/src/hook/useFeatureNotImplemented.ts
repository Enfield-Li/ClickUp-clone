import { useToast } from "@chakra-ui/react";

export default function useUnImplementedToast(msg?: string) {
  return useToast({
    status: "error",
    title: "Nope",
    description: msg || "I haven't implemented this feature yet...",
  });
}
