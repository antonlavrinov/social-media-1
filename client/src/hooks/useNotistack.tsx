import { VariantType, useSnackbar } from "notistack";
import CustomNotification from "../components/CustomNotification";
import CustomPageNotification from "../components/CustomPageNotification";

const useNotistack = () => {
  const { enqueueSnackbar } = useSnackbar();

  const handleNotification = (message: any, variant: VariantType) => {
    console.log("variant", variant);
    enqueueSnackbar(message, {
      variant,
      content: (key: any, message: any) => (
        <CustomNotification id={key} message={message} />
      ),
    });
  };

  const handlePageNotification = (message: any, variant?: VariantType) => {
    enqueueSnackbar(message, {
      variant,
      content: (key: any, message: any) => (
        <CustomPageNotification id={key} message={message} />
      ),
    });
  };
  return { handleNotification, handlePageNotification };
};

export default useNotistack;
