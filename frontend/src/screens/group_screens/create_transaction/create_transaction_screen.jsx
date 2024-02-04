import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ChevronLeft from "../../../../assets/svg/chevron_left";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/dimensions";
import { useGlobalStore } from "../../../store/global_store";

export default function CreateTransactionScreen() {
  const pickerRef = useRef();
  const nav = useNavigation();
  const users = useGlobalStore((state) => state.selectedGroupUsers);
  const [payer, setPayer] = useState(users[0].id);
  const [splitEqually, setSplitEqually] = useState(false);
  let txnMap = useRef({});
  let amount = useRef(0);
  let note = useRef("");
  const [selectedPeople, setSelectedPeople] = useState([]);
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const jwt = useGlobalStore((state) => state.jwt);
  const name = useGlobalStore((state) => state.name);
  const [isLoading, setLoading] = useState(false);

  const openPicker = () => {
    pickerRef.current.focus();
  };

  function getNameFromCode() {
    const groupCode = useGlobalStore((state) => state.selectedGroupCode);
    const groups = useGlobalStore((state) => state.groups);
    return groups.find((group) => group.code === groupCode).name;
  }

  const getUserNameFromId = (id) => {
    return users.find((user) => user.id === id).username === name
      ? "You"
      : users.find((user) => user.id === id).username;
  };

  useEffect(() => {
    calculateTxnMap();
  }, [selectedPeople, amount.current]);

  function calculateTxnMap() {
    if (amount.current !== 0) {
      if (splitEqually) {
        const amountPerPerson = amount.current / selectedPeople.length;
        const newTxnMap = {};
        selectedPeople.forEach((id) => {
          newTxnMap[id] = amountPerPerson;
        });
        txnMap.current = newTxnMap;
      }
      console.log(txnMap);
    }
  }

  async function addExpense() {
    setLoading(true);
    const tempTxnMap = {};
    Object.keys(txnMap.current).forEach((id) => {
      tempTxnMap[id] = parseFloat(txnMap.current[id].toFixed(2));
    });
    console.log(tempTxnMap);
    const raw = JSON.stringify({
      lender: tempTxnMap,
      receiver: payer,
      amount: amount.current,
      note: note.current,
    });
    console.log(raw);
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/txn/group/" + code,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: raw,
      }
    );
    const text = await response.text();
    if (response.status !== 200) {
      setLoading(false);
      ToastAndroid.show("Error in adding expense", ToastAndroid.SHORT);
    }
    if (response.ok) {
      setLoading(false);
      nav.goBack();
      return;
    }
    setLoading(false);
    ToastAndroid.show("Error", ToastAndroid.SHORT);
  }
  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>{getNameFromCode()}</Text>
      </View>
      <Text style={styles.helperText}>Add Expense</Text>
      <View style={styles.detailsRow}>
        <View style={styles.noteLogoContainer}>
          <Image source={require("../../../../assets/png/note.png")} />
        </View>
        <View style={styles.textFieldColumn}>
          <TextInput
            placeholder="Add Description"
            placeholderTextColor="#969696"
            style={styles.input}
            textAlignVertical="bottom"
            onChange={(event) => {
              note.current = event.nativeEvent.text;
            }}
          />
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.noteLogoContainer}>
          <Image source={require("../../../../assets/png/solana.png")} />
        </View>
        <View style={styles.textFieldColumn}>
          <TextInput
            placeholder="Amount Paid"
            placeholderTextColor="#969696"
            style={styles.input}
            keyboardType={"numeric"}
            textAlignVertical="bottom"
            onChange={(event) => {
              amount.current = parseFloat(event.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View style={styles.pickerRow}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.paidByText}>Paid By</Text>
          <View
            style={{
              width: 0,
              height: 0,
              opacity: 0,
            }}
          >
            <Picker
              selectedValue={payer}
              ref={pickerRef}
              onValueChange={(itemValue, _) => {
                console.log(itemValue);
                setPayer(itemValue);
              }}
              mode={"dialog"}
            >
              {users.map((user) => {
                return <Picker.Item label={user.username} value={user.id} />;
              })}
            </Picker>
          </View>
          <Pressable onPress={openPicker}>
            <View style={styles.payerNameBox}>
              <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={styles.payerName}
              >
                {getUserNameFromId(payer)}
              </Text>
            </View>
          </Pressable>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.paidByText}> Split Equally</Text>
          <View
            style={[
              styles.checkBox,
              { backgroundColor: splitEqually ? "#0382EB" : "transparent" },
            ]}
            onTouchEnd={() => setSplitEqually(!splitEqually)}
          >
            <View
              style={{
                opacity: splitEqually ? 1 : 0,
              }}
            >
              <Image
                source={require("../../../../assets/png/tick.png")}
                style={{ height: 10, width: 14 }}
              />
            </View>
          </View>
        </View>
      </View>
      <ScrollView style={styles.peopleList}>
        {users.map((user) => {
          return (
            <View style={styles.balanceItem} key={user.pubKey}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri: user.image,
                  }}
                  style={styles.avatar}
                />
                <Text style={styles.username}>
                  {getUserNameFromId(user.id)}
                </Text>
              </View>
              {splitEqually ? (
                <View
                  style={[
                    styles.checkBox,
                    {
                      backgroundColor: selectedPeople.includes(user.id)
                        ? "#0382EB"
                        : "transparent",
                    },
                  ]}
                  onTouchEnd={() => {
                    if (selectedPeople.includes(user.id)) {
                      setSelectedPeople(
                        selectedPeople.filter((id) => id !== user.id)
                      );
                    } else {
                      setSelectedPeople([...selectedPeople, user.id]);
                    }
                  }}
                >
                  <View
                    style={{
                      opacity: selectedPeople.includes(user.id) ? 1 : 0,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/png/tick.png")}
                      style={{ height: 10, width: 14 }}
                    />
                  </View>
                </View>
              ) : (
                <TextInput
                  placeholderTextColor={"white"}
                  style={styles.shareInput}
                  keyboardType={"numeric"}
                  textAlignVertical="bottom"
                  onChange={(event) => {
                    if (amount.current === 0) return;
                    if (parseFloat(event.nativeEvent.text) > 0) {
                      const newTxnMap = { ...txnMap.current };
                      newTxnMap[user.id] = parseFloat(event.nativeEvent.text);
                      txnMap.current = newTxnMap;
                    } else {
                      const newTxnMap = { ...txnMap.current };
                      delete newTxnMap[user.id];
                      txnMap.current = newTxnMap;
                    }
                    console.log(txnMap);
                  }}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <View
        style={styles.addExpenseBtn}
        onTouchEnd={async () => {
          calculateTxnMap();
          console.log(amount);
          if (note.current === "") {
            ToastAndroid.show("Please enter a note", ToastAndroid.SHORT);
            return;
          }
          if (amount.current === 0) {
            ToastAndroid.show("Amount cannot be 0", ToastAndroid.SHORT);
            return;
          }
          console.log(txnMap.current);
          if (Object.keys(txnMap.current).length === 0) {
            ToastAndroid.show(
              "Please select atleast one person",
              ToastAndroid.SHORT
            );
            return;
          }
          const sumOfTxnMap = Object.values(txnMap.current).reduce(
            (a, b) => a + b,
            0
          );
          console.log(sumOfTxnMap.toFixed(2), amount.current);
          if (sumOfTxnMap.toFixed(2) !== amount.current.toFixed(2)) {
            ToastAndroid.show(
              "Total Amount not matching the Individual Shares",
              ToastAndroid.LONG
            );
            return;
          }
          await addExpense();
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.addExpenseTxt}> Add Expense </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#161620",
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    paddingHorizontal: horizontalScale(28),
  },
  addExpenseBtn: {
    borderRadius: 4,
    backgroundColor: "#0382EB",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(30),
    width: "100%",
  },
  addExpenseTxt: {
    fontFamily: "BeVietnamPro-SemiBold",
    color: "white",
    fontSize: 16,
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
  txnFields: {
    paddingTop: verticalScale(28),
  },
  detailsRow: {
    marginTop: verticalScale(40),
    flexDirection: "row",
    alignItems: "center",
  },
  noteLogoContainer: {
    height: verticalScale(60),
    width: horizontalScale(60),
    borderColor: "#0382EB",
    borderWidth: 1,
    backgroundColor: "#373A40",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  textFieldColumn: {
    marginLeft: horizontalScale(16),
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Thin",
  },
  pickerRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: verticalScale(40),
    alignItems: "center",
  },
  paidByText: {
    fontFamily: "BeVietnamPro-SemiBold",
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  payerNameBox: {
    marginLeft: horizontalScale(20),
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(20),
    width: horizontalScale(88),
    borderColor: "#0382EB",
    borderWidth: 1,
    backgroundColor: "#373A40",
    borderRadius: 4,
  },
  payerName: {
    fontFamily: "BeVietnamPro-SemiBold",
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  checkBox: {
    height: verticalScale(35),
    width: horizontalScale(35),
    marginLeft: horizontalScale(11),
    borderWidth: 2,
    borderColor: "#0382EB",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  peopleList: {
    marginTop: verticalScale(23),
    flex: 1,
    width: "100%",
  },
  balanceItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  shareInput: {
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Thin",
  },
});
