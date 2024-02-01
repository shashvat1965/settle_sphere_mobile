import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TransactionRow from "./transaction_row";
import { useEffect, useState } from "react";
import { useGlobalStore } from "../../store/global_store";
import { verticalScale } from "../../utils/dimensions";

export default function TransactionsList() {
  const [organizedData, setOrganizedData] = useState(null);
  const history = useGlobalStore((state) => state.txnHistory);
  const users = useGlobalStore((state) => state.selectedGroupUsers);
  const name = useGlobalStore((state) => state.name);

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
      const createdAt = new Date(transaction.created_at);
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

    // Sort the months in descending order
    const sortedMonths = Object.keys(organizedData).sort(
      (a, b) => months.indexOf(b) - months.indexOf(a)
    );

    // Create a new object with sorted months and sorted dates inside each month
    const sortedOrganizedData = {};
    sortedMonths.forEach((month) => {
      const sortedDates = Object.keys(organizedData[month]).sort(
        (a, b) => b - a
      );
      sortedOrganizedData[month] = {};

      sortedDates.forEach((date) => {
        const sortedTxns = organizedData[month][date].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        sortedOrganizedData[month][date] = organizedData[month][date].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });
    });

    return sortedOrganizedData;
  }

  useEffect(() => {
    if (history === null) return;
    const organizedData = organizeTransactionsByMonth(history);
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
                    <TransactionRow
                      key={transaction.id}
                      isSettled={transaction.settled}
                      note={transaction.note}
                      amount={transaction.amount.toFixed(2)}
                      lender={getUserNameFromId(transaction.payerId)}
                      receiver={getUserNameFromId(transaction.receiverId)}
                      date={dateKey}
                    />
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
