import { Image, StyleSheet, View, Text, TextInput } from "react-native";
import React, { useCallback, useEffect } from "react";
import ConnectWalletButton from "./connect_wallet";
import { useGlobalStore } from "../../store/global_store";
import { useShallow } from "zustand/react/shallow";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { name, setName, jwt, setUserId } = useGlobalStore(
    useShallow((state) => ({
      name: state.name,
      setName: state.setName,
      jwt: state.jwt,
      setUserId: state.setUserId,
    }))
  );
  const nav = useNavigation();

  useEffect(() => {
    if (jwt !== "") {
      nav.navigate("home");
      return;
    }
    setName("");
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (jwt !== "") {
        nav.navigate("home");
        return;
      }
      return () => {};
    })
  );

  return (
    <View style={styles.loginContainer}>
      <Image
        style={styles.img}
        source={require("../../../assets/png/login_asset.png")}
      />
      <Text style={styles.signUpText}>Settle Sphere</Text>
      <View style={styles.nameInputContainer}>
        <TextInput
          placeholder="Name"
          placeholderTextColor="#747474"
          style={styles.nameInput}
          textAlignVertical="bottom"
          onChange={(nativeEvent) => {
            setName(nativeEvent.nativeEvent.text);
          }}
        />
      </View>
      <ConnectWalletButton />
      {name === "" ? (
        <Text style={styles.errorText}>Please enter Name to continue</Text>
      ) : (
        <View />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    backgroundColor: "#161620",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  img: {
    height: verticalScale(426),
    width: horizontalScale(324),
  },
  signUpText: {
    color: "white",
    fontSize: 24,
    paddingTop: verticalScale(30),
    marginBottom: verticalScale(10),
    fontFamily: "Orbitron-ExtraBold",
  },
  nameInputContainer: {
    paddingHorizontal: horizontalScale(46),
    width: "100%",
  },
  nameInput: {
    fontSize: 20,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Medium",
  },
  errorText: {
    marginTop: verticalScale(130),
    fontSize: 16,
    color: "#CF2E2E",
    fontFamily: "BeVietnamPro-Medium",
  },
});
