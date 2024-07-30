"use client";
import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  Messaging,
  onMessage,
} from "firebase/messaging";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

const id = v4();

function requestPermission() {
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyDabBEarpEgoyT3cYCv4U685K_lro9aobI",
  authDomain: "rawcaster-4d152.firebaseapp.com",
  projectId: "rawcaster-4d152",
  storageBucket: "rawcaster-4d152.appspot.com",
  messagingSenderId: "1000725856320",
  appId: "1:1000725856320:web:b62c13c87c6251cf195fa5",
  measurementId: "G-SWGCRXDB4Z",
};

const initFB = () => {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  return messaging;
};

export default function Home() {
  const [token, setToken] = useState("");
  const [messaging, setMessaging] = useState<Messaging | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const _messaging = initFB();
      setMessaging(_messaging);
    }
  }, []);

  useEffect(() => {
    if (messaging) {
      requestPermission();
      getToken(messaging, {
        vapidKey:
          "BEjbJ9p2i9RF84Okjr62JAZ_LWqVKcotzgT4EzTBTH_042-VwolQcgg5Qw8CcAwt8hLQqcobV3eDQcnHulKdeb8",
      })
        .then((currentToken) => {
          console.log(currentToken);

          if (currentToken) {
            setToken(currentToken);
          } else {
            // Show permission request UI
            console.log(
              "No registration token available. Request permission to generate one."
            );
            // ...
          }
        })
        .catch((err) => {
          console.log("An error occurred while retrieving token. ", err);
          // ...
        });

      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
        // ...
      });
    }
  });

  useEffect(() => {
    setDeviceId(id);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        gap: 50,
        paddingTop: 50,
      }}
    >
      <span>deviceToken: {`   ${token}`}</span>
      <span>deviceId:{`   ${deviceId}`}</span>
    </div>
  );
}
