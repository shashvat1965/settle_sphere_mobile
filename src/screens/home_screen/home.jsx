import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import HomeHeader from "./header";
import HomeCard from "./home_card";
import GroupList from "./group_list";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStore } from "../../store/global_store";

export default function HomeScreen() {
  const navigation = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);

  useEffect(() => {
    navigation.addListener("beforeRemove", (e) => {
      if (jwt !== "") {
        e.preventDefault();
      }
    });
  }, []);

  return (
    <View style={styles.homeContainer}>
      <HomeHeader />
      <HomeCard />
      <GroupList />
    </View>
  );
}

const styles = StyleSheet.create({
  homeContainer: {
    backgroundColor: "#161620",
    display: "flex",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(54),
    width: "100%",
  },
  contentContainer: {},
});
