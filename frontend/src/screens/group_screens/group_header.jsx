import { Image, StyleSheet, Text, View } from "react-native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";
import Clipboard from "@react-native-community/clipboard";

export default function GroupHeader() {
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const group = useGlobalStore((state) => state.groups).find(
    (g) => g.code === code
  );
  const netAmount = useGlobalStore((state) => state.netAmount);

  const status = netAmount < 0 ? 1 : 0;

  function textFromStatus() {
    if (netAmount <= 0) {
      return "You get back ";
    } else if (netAmount >= 0) {
      return "You owe ";
    }
  }

  const getAmount = () => {
    const amount = netAmount.toFixed(2);
    return amount < 0 ? -1 * amount : amount;
  };

  return (
    <View style={styles.groupDetails}>
      <Image
        source={{ uri: group.image }}
        style={{
          width: horizontalScale(110),
          height: verticalScale(123),
          borderRadius: 4,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.groupName}>
          {group.name}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.groupAmountText}>{textFromStatus()}</Text>
          <Text
            style={[
              styles.groupAmountNumber,
              { color: status === 0 ? "#AB640E" : "#619C12" },
            ]}
          >
            {getAmount()}
          </Text>
          <Image
            source={require("../../../assets/png/solana.png")}
            style={{ width: 24, height: 24 }}
          />
        </View>
        <View style={{ flex: 1 }}></View>
        <View
          style={styles.copyBtn}
          onTouchEnd={() => Clipboard.setString(code)}
        >
          <Text style={styles.copyText}>Copy Group Code</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupDetails: {
    marginTop: verticalScale(20),
    width: "100%",
    flexDirection: "row",
    gap: horizontalScale(23),
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: horizontalScale(30),
  },
  groupName: {
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 24,
  },
  groupAmountText: {
    fontFamily: "BeVietnamPro-Medium",
    color: "white",
    fontSize: 16,
  },
  highestTransaction: {
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 12,
    paddingRight: horizontalScale(8),
  },
  groupAmountNumber: {
    fontFamily: "BeVietnamPro-Bold",
    color: "#AB640E",
    fontSize: 18,
    paddingHorizontal: horizontalScale(10),
  },
  copyBtn: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  copyText: {
    marginVertical: verticalScale(9),
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    textAlignVertical: "center",
    lineHeight: verticalScale(19),
  },
});
