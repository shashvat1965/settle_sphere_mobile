import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";

export default function GroupButton() {
  const nav = useNavigation();

  return (
    <>
      <View style={styles.buttonRow}>
        <Pressable onPress={() => nav.navigate("select_txn")}>
          <View style={styles.settleButtonContainer}>
            <Text style={styles.buttonText}>Settle Up</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => nav.navigate("totals")}>
          <View style={styles.totalsButtonContainer}>
            <Text style={styles.buttonText}>Totals</Text>
          </View>
        </Pressable>
      </View>
      <View style={{ width: "100%", paddingHorizontal: 30 }}>
        <View style={styles.divider} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    marginTop: verticalScale(24),
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: horizontalScale(12),
  },
  settleButtonContainer: {
    backgroundColor: "#0382EB",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(7),
    paddingHorizontal: horizontalScale(52),
    width: "100%",
  },
  totalsButtonContainer: {
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(7),
    paddingHorizontal: horizontalScale(52),
    width: "100%",
    borderStyle: "solid",
    borderColor: "white",
    borderWidth: 1,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BeVietnamPro-Medium",
  },
  divider: {
    marginTop: verticalScale(20),
    width: "100%",
    height: 1,
    backgroundColor: "#2E2E42",
  },
});
