import { StyleSheet, Text, View } from "react-native";
import SolanaLogo from "../../../../assets/svg/solana";
import React from "react";

export default function StatRow({ statName, amount }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statName}>{statName}</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 23,
          width: "100%",
        }}
      >
        <View style={styles.logoBox}>
          <SolanaLogo />
        </View>
        <Text style={styles.statValue}> {amount} </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stat: {
    marginTop: 28,
    gap: 15,
  },
  statName: {
    fontFamily: "BeVietnamPro-Medium",
    color: "white",
    fontSize: 18,
  },
  logoBox: {
    padding: 15,
    borderColor: "#0382EB",
    borderWidth: 0.5,
    backgroundColor: "#373A40",
    borderRadius: 4,
  },
  statValue: {
    fontSize: 18,
    color: "white",
    borderBottomWidth: 1,
    paddingBottom: 10,
    flex: 1,
    alignSelf: "flex-end",
    textAlign: "auto",
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Medium",
  },
});
