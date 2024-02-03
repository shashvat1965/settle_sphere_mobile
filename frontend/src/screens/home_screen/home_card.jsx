import { Pressable, StyleSheet, Text, View } from "react-native";
import Card_lines from "../../../assets/svg/card_lines";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";

export default function HomeCard() {
  const nav = useNavigation();
  return (
    <View style={styles.cardBg}>
      <View style={styles.svgImage}>
        <Card_lines />
      </View>
      <Text style={styles.cardText}>Welcome, Settle your{"\n"}dues now</Text>
      <View style={styles.createGroupButton}>
        <Pressable onPress={() => nav.navigate("create_group")}>
          <Text style={styles.buttonText}>Create Group</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBg: {
    width: "100%",
    display: "flex",
    backgroundColor: "#131313",
    marginTop: verticalScale(36),
    borderRadius: 8,
    paddingLeft: horizontalScale(20),
    paddingTop: verticalScale(16),
    overflow: "hidden",
  },
  svgImage: {
    position: "absolute",
    right: 0,
    zIndex: 0,
  },
  cardText: {
    fontFamily: "BeVietnamPro-Regular",
    color: "white",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  createGroupButton: {
    marginTop: verticalScale(24),
    marginBottom: verticalScale(37),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    backgroundColor: "#0382EB",
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  buttonText: {
    fontFamily: "BeVietnamPro-Regular",
    color: "white",
    fontSize: 16,
  },
});
