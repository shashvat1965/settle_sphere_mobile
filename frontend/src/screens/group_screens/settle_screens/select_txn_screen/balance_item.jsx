import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../../utils/dimensions";

export default function BalanceItem({ status, amount, avatar, username }) {
  amount = amount.toFixed(2);
  return (
    <View style={styles.balanceItem}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.username}>{username}</Text>
      </View>
      <View style={styles.balanceInfo}>
        <Text
          style={[
            styles.balanceType,
            { color: status === 0 ? "#AB640E" : "#619C12" },
          ]}
        >
          {status ? "You are owed" : "You owe"}
        </Text>
        <View style={styles.balanceAmountRow}>
          <Text style={styles.balanceAmount}>{amount}</Text>
          <Image source={require("../../../../../assets/png/solana.png")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(24),
  },
  avatar: {
    height: verticalScale(40),
    width: horizontalScale(40),
    borderRadius: 4,
  },
  username: {
    marginLeft: horizontalScale(20),
    fontFamily: "BeVietnamPro-Regular",
    color: "white",
    fontSize: moderateScale(20),
  },
  balanceInfo: {
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  balanceType: {
    fontFamily: "BeVietnamPro-SemiBold",
    color: "#619C12",
    fontSize: moderateScale(16),
  },
  balanceAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: horizontalScale(16),
  },
  balanceAmount: {
    color: "white",
    fontSize: moderateScale(20),
    fontFamily: "BeVietnamPro-Medium",
  },
});
