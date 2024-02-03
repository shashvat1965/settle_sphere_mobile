import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import TransactionRow from "./transaction_row";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../store/global_store";
import { verticalScale } from "../../utils/dimensions";
import { useNavigation } from "@react-navigation/native";

export default function TransactionsList() {
  const [organizedData, setOrganizedData] = useState(null);
  const history = useGlobalStore((state) => state.txnHistory);
  const users = useGlobalStore((state) => state.selectedGroupUsers);
  const name = useGlobalStore((state) => state.name);
  const nav = useNavigation();
  const userId = useGlobalStore((state) => state.globalUserId);

  function processTxns(id, data) {
    const organizedTxnMap = [];
    for (const groupId in data) {
      const group = data[groupId];

      let amount = 0;
      let totalAmount = 0;
      let type = 0;
      let note = "";
      let date = new Date();
      let payerId = null;
      let paymentMap = {};
      let set = false;

      Object.values(group).map((txn) => {
        note = txn.note;
        totalAmount = txn.total_amount;
        date =
          date < new Date(txn.created_at) ? date : new Date(txn.created_at);
        payerId = txn.payerId;

        if (!set) {
          if (txn.settled) {
            type = 0; // settled
            set = true;
          } else if (txn.payerId === id) {
            type = 1; // lender
            set = true;
          } else if (txn.receiverId === id) {
            type = 2; // lending
            set = true;
          } else {
            type = 3; // not involved
          }
        }

        amount = amount + txn.amount;

        paymentMap[txn.receiverId] = txn.amount;
      });

      paymentMap[payerId] = totalAmount - amount;

      organizedTxnMap.push({
        note: note,
        payerId: payerId,
        paymentMap: paymentMap,
        total_amount: totalAmount,
        type: type,
        date: date,
        amount: amount,
      });
    }
    return organizedTxnMap;
  }

  function organizeTransactionsByMonth(transactions) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const organizedData = {};

    transactions.forEach((transaction) => {
      const createdAt = new Date(transaction.date);
      const monthName = months[createdAt.getMonth()];
      const dateKey = `${createdAt.getDate()}`.padStart(2, "0");

      if (!organizedData[monthName]) {
        organizedData[monthName] = {};
      }

      if (!organizedData[monthName][dateKey]) {
        organizedData[monthName][dateKey] = [];
      }

      organizedData[monthName][dateKey].push(transaction);
    });

    const sortedMonths = Object.keys(organizedData).sort(
      (a, b) => months.indexOf(a) - months.indexOf(b)
    );

    const sortedOrganizedData = {};
    sortedMonths.forEach((month) => {
      const sortedDates = Object.keys(organizedData[month]).sort(
        (a, b) => a - b
      );
      sortedOrganizedData[month] = {};

      sortedDates.forEach((date) => {
        sortedOrganizedData[month][date] = organizedData[month][date].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      });
    });

    console.log(sortedOrganizedData);

    return sortedOrganizedData;
  }

  useEffect(() => {
    if (history === null) return;
    const processedData = processTxns(userId, history);
    const organizedData = organizeTransactionsByMonth(processedData);
    setOrganizedData(organizedData);
  }, [history]);

  const getUserNameFromId = (id) => {
    return users.find((user) => user.id === id).username === name
      ? "You"
      : users.find((user) => user.id === id).username;
  };

  if (organizedData === null) {
    console.log("organizedData: ", organizedData);
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: verticalScale(150),
        }}
      >
        <Text
          style={{
            color: "#C9C9C9",
            fontFamily: "BeVietnamPro-Medium",
            fontSize: 20,
          }}
        >
          No Transactions Yet
        </Text>
      </View>
    );
  } else {
    return (
      <ScrollView
        contentContainerStyle={{
          width: "100%",
          paddingBottom: verticalScale(150),
        }}
      >
        {Object.keys(organizedData).map((monthName) => {
          return (
            <View key={monthName} style={{ marginBottom: verticalScale(20) }}>
              <Text style={styles.transactionMonth}>{monthName}</Text>
              {Object.keys(organizedData[monthName]).map((dateKey) => {
                return organizedData[monthName][dateKey].map((transaction) => {
                  return (
                    <Pressable
                      onPress={() => {
                        if (transaction.type === 0) return;
                        nav.navigate("txn_details", {
                          paymentMap: transaction.paymentMap,
                          note: transaction.note,
                        });
                      }}
                    >
                      <TransactionRow
                        key={transaction.id}
                        note={transaction.note}
                        amount={transaction.amount.toFixed(2)}
                        lender={getUserNameFromId(transaction.payerId)}
                        receiver={"Shashvat"}
                        date={dateKey}
                        type={transaction.type}
                        paymentMap={transaction.paymentMap}
                        netAmount={transaction.total_amount.toFixed(2)}
                      />
                    </Pressable>
                  );
                });
              })}
            </View>
          );
        })}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  transactionMonth: {
    color: "#C9C9C9",
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 20,
  },
});
