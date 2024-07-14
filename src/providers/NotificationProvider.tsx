import { ExpoPushToken } from "expo-notifications";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@lib/notifications";
import { useAuth } from "./AuthProvider";
import { supabase } from "../lib/supabase";

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { profile: user } = useAuth();

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const saveToken = async (newToken: string | undefined) => {
    if (!user) return;
    setExpoPushToken(newToken);

    // update push token in the database
    await supabase
      .from("profiles")
      .update({ push_token: newToken })
      .eq("id", user.id);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        saveToken(token);
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // console.log("In np -> notification : ", notification);
  // console.log("In np -> exporPushToken : ", expoPushToken);

  return <>{children}</>;
};

export default NotificationProvider;
