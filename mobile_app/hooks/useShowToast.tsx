import { useToast } from "react-native-toast-notifications";
import { ToastOptions } from "react-native-toast-notifications/lib/typescript/toast";

type Args = {
  message?: string;
  options?: ToastOptions;
};

export default function useShowToast() {
  const toast = useToast();

  return (
    message: string = "Not Implemented",
    options: ToastOptions = {
      type: "danger",
      duration: 1500,
      placement: "bottom",
    }
  ) => toast.show(message, options);
}
