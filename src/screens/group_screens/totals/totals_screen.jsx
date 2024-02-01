import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import ChevronLeft from "../../../../assets/svg/chevron_left";
import React, { useEffect, useState } from "react";
import StatRow from "./stat_row";
import { useNavigation } from "@react-navigation/native";
import { useGlobalStore } from "../../../store/global_store";

export default function TotalsScreen() {
  const nav = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const [stats, setStats] = useState(null);
  async function fetchStats() {
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups/stats/" + code,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    );
    const text = await response.text();
    try {
      console.log(text);
      setStats(JSON.parse(text));
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (stats === null) {
    return (
      <View
        style={[
          styles.screenContainer,
          { alignContent: "center", justifyContent: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>Group Name</Text>
      </View>
      <Text style={styles.summaryHeading}>Group Spending Summary</Text>
      <View style={styles.statsCol}>
        <StatRow
          statName="Total Group Spending"
          amount={stats.total_group_spending}
        />
        <StatRow
          statName="Total You Paid For"
          amount={stats.total_you_paid_for}
        />
        <StatRow statName="Your Total Share" amount={stats.your_total_share} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#161620",
    height: "100%",
    display: "flex",
    paddingHorizontal: 30,
  },
  topBar: {
    width: "100%",
    marginTop: 55,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "BeVietnamPro-ExtraBold",
    color: "white",
    fontSize: 24,
    marginLeft: 8,
  },
  summaryHeading: {
    marginTop: 33,
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 20,
  },
  statsCol: {
    marginTop: 7,
  },
});
