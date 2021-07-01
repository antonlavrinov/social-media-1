import React, { useState } from "react";
import { useHttp } from "./useHttp";
import useNotistack from "./useNotistack";
import Resizer from "react-image-file-resizer";

export const useUploadImages = () => {
  const [images, setImages] = useState<any[]>([]);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const { handlePageNotification } = useNotistack();
  const { request } = useHttp();

  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        700,
        700,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLoading(true);
    e.preventDefault();
    if (e.target.files) {
      for (let i = 0; i < e.target.files!.length; i++) {
        const file = e.target.files![i];
        const resized = await resizeFile(file);
        try {
          const res = await request("/api/upload-image", "POST", {
            image: resized,
          });

          setImages((prevState) => {
            return [res, ...prevState];
          });
          e.target.files = null;
          e.target.value = "";
          setImageLoading(false);
        } catch (e) {
          console.log(e);
          handlePageNotification({ type: "error", text: e.message });
          setImageLoading(false);
        }
      }
    }
  };

  const handleRemoveImage = async (image: any) => {
    setImages((prevState: any) => {
      const newArr = prevState.filter(
        (el: any) => el.public_id !== image.public_id
      );
      return newArr;
    });

    try {
      await request(`/api/remove-image/${image.public_id}`, "DELETE");
    } catch (e) {
      console.log(e);
    }
  };

  return {
    handleUploadImages,
    handleRemoveImage,
    images,
    setImages,
    imageLoading,
  };
};
