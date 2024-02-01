import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuthorization } from "../../../components/providers/AuthorizationProvider";
import React, { useCallback, useState } from "react";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { useNavigation } from "@react-navigation/native";
import { fromUint8Array } from "js-base64";
import { useGlobalStore } from "../../store/global_store";
import { useShallow } from "zustand/react/shallow";
import { horizontalScale, verticalScale } from "../../utils/dimensions";

export default function ConnectWalletButton() {
  const { authorizeSession } = useAuthorization();
  const nav = useNavigation();
  const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
  const { name, setName, setJwt, setPubKey, setProfilePicture } =
    useGlobalStore(
      useShallow((state) => ({
        name: state.name,
        setName: state.setName,
        setJwt: state.setJwt,
        setPubKey: state.setPubKey,
        setProfilePicture: state.setProfilePictureUrl,
      }))
    );

  const login = async (data) => {
    fetch("https://bits-dvm.org/settlesphere/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setAuthorizationInProgress(false);
        setJwt(data.token);
        setPubKey(data.user.pubKey);
        setName(name);
        setProfilePicture(data.user.image);
        nav.navigate("home");
      })
      .catch((error) => {
        setAuthorizationInProgress(false);
        console.error("Error:", error);
      });
  };

  const btnPressHandle = async () => {
    if (name !== "") {
      if (name.toLowerCase() === "you") return;
      setAuthorizationInProgress(true);
      const message = "settlesphere";
      const messageBuffer = new Uint8Array(
        message.split("").map((c) => c.charCodeAt(0))
      );

      const data = await transact(async (wallet) => {
        const authorizationResult = await authorizeSession(wallet);
        console.log(authorizationResult);
        const signedMessages = await wallet.signMessages({
          addresses: [authorizationResult.address],
          payloads: [messageBuffer],
        });

        return {
          name: name,
          pubKey: authorizationResult.publicKey,
          signature: fromUint8Array(signedMessages[0]),
        };
      });
      console.log(data);
      await login(data);
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      <Pressable onPress={btnPressHandle}>
        <View style={styles.buttonContainer}>
          {authorizationInProgress ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text style={styles.buttonText}>Connect Wallet</Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: verticalScale(32),
    backgroundColor: "#0382EB",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    width: "100%",
  },
  buttonWrapper: {
    width: "100%",
    paddingHorizontal: horizontalScale(40),
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BeVietnamPro-Medium",
  },
});
