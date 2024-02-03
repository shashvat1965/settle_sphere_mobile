import { Image, StyleSheet, Text, View } from "react-native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";

export default function TransactionRow({
  note,
  amount,
  lender,
  date,
  netAmount,
  type,
  paymentMap,
}) {
  const users = useGlobalStore((state) => state.selectedGroupUsers);
  const name = useGlobalStore((state) => state.name);

  const getUserNameFromId = (id) => {
    const x = users.find((user) => user.id.toString() === id).username;
    return x === name ? "You" : x;
  };

  const text = () => {
    if (type === 0) {
      let tempNote = "";
      Object.keys(paymentMap).map((key) => {
        if (getUserNameFromId(key) !== lender) {
          tempNote =
            getUserNameFromId(key) + " Paid " + amount + " SOLs to " + lender;
        }
      });
      return tempNote;
    } else {
      return note;
    }
  };

  const statusText = () => {
    if (type === 3) {
      return "Not Involved";
    } else if (type === 1) {
      return "You Lent";
    } else if (type === 2) {
      return "You Borrowed";
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
          {!(type === 0) ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.transactionAmountText}>
                {lender + " Paid " + netAmount}
              </Text>
              <Image source={require("../../../assets/png/solana.png")} />
            </View>
          ) : (
            <></>
          )}
        </View>
      </View>
      <>
        {!(type === 0) ? (
          <View style={styles.transactionTypeDetails}>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                styles.transactionTypeDescription,
                {
                  color:
                    type === 1 ? "#619C12" : type === 2 ? "#AB640E" : "grey",
                },
              ]}
            >
              {statusText()}
            </Text>
            {!(type === 3) && (
              <View style={{ flexDirection: "row", gap: horizontalScale(2) }}>
                <Text style={styles.transactionTotalAmountNumber}>
                  {amount}
                </Text>
                <Image source={require("../../../assets/png/solana.png")} />
              </View>
            )}
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
