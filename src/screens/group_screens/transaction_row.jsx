import { Image, StyleSheet, Text, View } from "react-native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";

export default function TransactionRow({
  isSettled,
  note,
  amount,
  lender,
  receiver,
  date,
}) {
  const text = () => {
    if (isSettled) {
      return receiver + " Paid " + amount + " SOLs to " + lender;
    } else {
      return note;
    }
  };
  const status = () => {
    if (lender === "You") {
      return 0;
    } else {
      if (receiver === "You") {
        return 1;
      } else {
        return 2;
      }
    }
  };
  const statusText = () => {
    if (lender === "You") {
      return receiver + " Borrowed";
    } else {
      if (receiver === "You") {
        return "You Lent";
      } else {
        return receiver + " Borrowed";
      }
    }
  };

  return (
    <View style={styles.transactionRow}>
      <View
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Text style={styles.transactionDate}>{date}</Text>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionNote}>{text()}</Text>
          {!isSettled ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.transactionAmountText}>
                {lender + " Paid " + amount}
              </Text>
              <Image source={require("../../../assets/png/solana.png")} />
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
      <>
        {!isSettled ? (
          <View style={styles.transactionTypeDetails}>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                styles.transactionTypeDescription,
                {
                  color:
                    status() === 0
                      ? "#619C12"
                      : status() === 1
                      ? "#AB640E"
                      : "grey",
                },
              ]}
            >
              {statusText()}
            </Text>
            <View style={{ flexDirection: "row", gap: horizontalScale(2) }}>
              <Text style={styles.transactionTotalAmountNumber}>{amount}</Text>
              <Image source={require("../../../assets/png/solana.png")} />
            </View>
          </View>
        ) : (
          <></>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  transactionRow: {
    marginTop: verticalScale(12),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  transactionDate: {
    color: "#767676",
    fontFamily: "BeVietnamPro-Medium",
    fontSize: 20,
  },
  transactionNote: {
    color: "white",
    fontFamily: "BeVietnamPro-Regular",
    fontSize: 18,
  },
  transactionAmountText: {
    fontFamily: "BeVietnamPro-Medium",
    color: "#767676",
    fontSize: 14,
    marginRight: horizontalScale(2),
  },
  transactionTotalAmountNumber: {
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 16,
    paddingLeft: horizontalScale(5),
  },
  transactionDetails: {
    paddingLeft: horizontalScale(10),
  },
  transactionTypeDescription: {
    color: "#AB640E",
    fontFamily: "BeVietnamPro-Bold",
    fontSize: 13,
  },
  transactionTypeDetails: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
});
