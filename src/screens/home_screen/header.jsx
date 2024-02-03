import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useGlobalStore } from "../../store/global_store";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useNavigation } from "@react-navigation/native";

export default function HomeHeader() {
  const name = useGlobalStore((state) => state.name);
  const avatar = useGlobalStore((state) => state.profilePictureUrl);
  const nav = useNavigation();
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Hello {name}!</Text>
      <View
        style={{
          flexDirection: "row",
          gap: horizontalScale(11),
        }}
      >
        <Pressable onPress={() => nav.navigate("join_group")}>
          <Image
            source={require("../../../assets/png/join_group.png")}
            style={{ height: verticalScale(30), width: horizontalScale(40) }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            nav.navigate("profile_screen");
          }}
        >
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  greeting: {
    fontFamily: "BeVietnamPro-ExtraBold",
    color: "white",
    fontSize: 24,
    marginLeft: horizontalScale(8),
  },
  avatar: {
    height: verticalScale(40),
    width: horizontalScale(40),
    borderRadius: 20,
    marginRight: horizontalScale(12),
    backgroundColor: "grey",
  },
});
