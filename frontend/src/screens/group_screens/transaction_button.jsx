import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
export default function TransactionButton() {
  const nav = useNavigation();

  return (
    <Pressable
      onPress={() => {
        nav.navigate("create_txn");
      }}
    >
      <View style={styles.btn}>
        <Text style={styles.btnText}>Create Transaction</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#0382eb",
    backgroundColor: "#151B29",
    paddingVertical: verticalScale(20),
    paddingHorizontal: horizontalScale(20),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  btnText: {
    fontFamily: "BeVietnamPro-Medium",
    color: "white",
    fontSize: 16,
  },
});
