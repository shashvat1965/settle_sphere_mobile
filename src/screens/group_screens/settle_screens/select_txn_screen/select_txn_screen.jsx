import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ChevronLeft from "../../../../../assets/svg/chevron_left";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import BalanceItem from "./balance_item";
import { horizontalScale, verticalScale } from "../../../../utils/dimensions";
import { useGlobalStore } from "../../../../store/global_store";

export default function SelectTxnScreen() {
  const nav = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const [txns, setTxns] = useState(null);

  async function fetchTxns() {
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/txn/group/" + code,
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
      const data = JSON.parse(text);
      console.log(data);
      setTxns(data["txns"]);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchTxns();
      return () => {};
    }, [])
  );

  if (txns === null) {
    return (
      <View
        style={[
          { justifyContent: "center", alignItems: "center" },
          styles.screenContainer,
        ]}
      >
        <ActivityIndicator size="large" color="#ffffff" />
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
      <Text style={styles.helperText}> Select a Balance to Settle</Text>
      <ScrollView style={styles.balanceList}>
        {txns["owes"].map((txn) => {
          return (
            <Pressable
              key={txn.id}
              onPress={() =>
                nav.navigate("settle", {
                  status: 0,
                  payerUrl: txn.edges.source.image,
                  receiverUrl: txn.edges.destination.image,
                  pubKeyPayer: txn.edges.source.pubKey,
                  userId: txn.edges.destination.id,
                  pubKeyReceiver: txn.edges.destination.pubKey,
                  amount: txn.amount,
                })
              }
            >
              <BalanceItem
                key={txn.id}
                username={txn.edges.destination.username}
                amount={txn.amount}
                status={0}
                avatar={txn.edges.destination.image}
              />
            </Pressable>
          );
        })}
        {txns["receives"].map((txn) => {
          return (
            <Pressable
              key={txn.id}
              onPress={() =>
                nav.navigate("settle", {
                  status: 1,
                  payerUrl: txn.edges.source.image,
                  receiverUrl: txn.edges.destination.image,
                  userId: txn.edges.source.id,
                  pubKeyPayer: txn.edges.source.pubKey,
                  pubKeyReceiver: txn.edges.destination.pubKey,
                  amount: txn.amount,
                })
              }
            >
              <BalanceItem
                key={txn.id}
                username={txn.edges.source.username}
                amount={txn.amount}
                status={1}
                avatar={txn.edges.source.image}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#161620",
    height: "100%",
    display: "flex",
    paddingHorizontal: horizontalScale(26),
  },
  topBar: {
    width: "100%",
    marginTop: verticalScale(55),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headingText: {
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 24,
    marginLeft: horizontalScale(8),
  },
  helperText: {
    marginTop: verticalScale(33),
    fontFamily: "BeVietnamPro-SemiBold",
    color: "white",
    fontSize: 20,
  },
  balanceList: {
    marginTop: verticalScale(25),
  },
});
