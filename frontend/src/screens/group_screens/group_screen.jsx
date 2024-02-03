import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import ChevronLeft from "../../../assets/svg/chevron_left";
import GroupHeader from "./group_header";
import React, { useCallback, useState } from "react";
import GroupButton from "./group_buttons";
import TransactionsList from "./transactions_list";
import TransactionButton from "./transaction_button";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";

export default function GroupScreen() {
  const nav = useNavigation();
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const setHistory = useGlobalStore((state) => state.setTxnHistory);
  const jwt = useGlobalStore((state) => state.jwt);
  const setUsers = useGlobalStore((state) => state.setSelectedGroupUsers);
  const setNetAmount = useGlobalStore((state) => state.setNetAmount);
  const [isLoading, setLoading] = useState(true);
  const group = useGlobalStore((state) => state.groups).find(
    (g) => g.code === code
  );

  async function fetchTransactions() {
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/txn/group/" + code + "/history",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    );
    const text = await response.text();
    console.log(text);
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
  }

  async function fetchUsers() {
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups/members/" + code,
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
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
  }

  async function init() {
    setLoading(true);
    const users = await fetchUsers();
    const history = await fetchTransactions();
    setHistory(history["txn_history"]);
    setNetAmount(history["netAmount"]);
    console.log(history);
    setUsers(users["users"]);
    setLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      init().then((_) => console.log("Group Screen Init"));
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.screenContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.screenContainer}>
      <View style={styles.imgContainer}>
        <View style={styles.chevron}>
          <Pressable onPress={() => nav.navigate("home")}>
            <ChevronLeft />
          </Pressable>
        </View>
        <Image
          style={styles.img}
          resizeMode={"cover"}
          resizeMethod={"auto"}
          source={{ uri: group.image }}
        />
      </View>
      <GroupHeader />
      <GroupButton />
      <View style={styles.groupTransactions}>
        <TransactionsList />
      </View>
      <View style={styles.transactionButton}>
        <TransactionButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#161620",
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    width: "100%",
    backgroundColor: "white",
    height: verticalScale(172),
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  img: {
    width: "100%",
    height: "100%",
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
  },
  chevron: {
    position: "absolute",
    left: horizontalScale(20),
    top: verticalScale(70),
    zIndex: 1,
  },
  groupTransactions: {
    paddingTop: verticalScale(20),
    paddingLeft: horizontalScale(35),
    paddingRight: horizontalScale(25),
    flex: 1,
    width: "100%",
  },
  transactionButton: {
    position: "absolute",
    bottom: verticalScale(50),
    width: "100%",
    paddingHorizontal: horizontalScale(30),
  },
});
