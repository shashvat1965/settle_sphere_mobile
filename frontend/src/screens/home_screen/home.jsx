import { ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import React, { useCallback, useEffect } from "react";
import HomeHeader from "./header";
import HomeCard from "./home_card";
import GroupList from "./group_list";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useGlobalStore } from "../../store/global_store";

export default function HomeScreen() {
  const navigation = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);

  useFocusEffect(
    useCallback(() => {
      if (jwt === "") {
        navigation.goBack();
      }
      return () => {};
    })
  );

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
