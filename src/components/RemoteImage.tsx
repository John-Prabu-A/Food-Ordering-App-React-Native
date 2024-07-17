import { Image, ImageSourcePropType } from "react-native";
import React, { ComponentProps, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type RemoteImageProps = {
  path?: string | null;
  fallback: ImageSourcePropType;
  bucketName?: string;
} & Omit<ComponentProps<typeof Image>, "source">;

const RemoteImage = ({
  path,
  fallback,
  bucketName,
  ...imageProps
}: RemoteImageProps) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setImage(null);
      return;
    }

    const fetchImage = async () => {
      try {
        setImage(null);
        const { data, error } = await supabase.storage
          .from(bucketName || "product-images")
          .download(path);

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const fr = new FileReader();
          fr.readAsDataURL(data);
          fr.onload = () => {
            setImage(fr.result as string);
          };
        }
      } catch (error) {
        // Alert.alert("Error", "Error Fetching Image");
      }
    };

    fetchImage();
  }, [path]);
  const adjustedProps = {
    ...imageProps,
    style: [imageProps.style],
  };

  return (
    <Image
      {...adjustedProps}
      source={image !== null ? { uri: image } : fallback}
    />
  );
};

export default RemoteImage;
