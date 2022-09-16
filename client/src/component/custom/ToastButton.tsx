import { useToast, Button } from "@chakra-ui/react";
import React from "react";

type Props = {
  text: string;
  title: string;
  description: string;
  status: "info" | "warning" | "success" | "error" | "loading" | undefined;
  duration: number;
  isClosable: boolean;
};

export default function ToastButton({
  text,
  title,
  description,
  status,
  duration,
  isClosable,
}: Props) {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title,
          description,
          status,
          duration,
          isClosable,
        })
      }
    >
      {text}
    </Button>
  );
}
