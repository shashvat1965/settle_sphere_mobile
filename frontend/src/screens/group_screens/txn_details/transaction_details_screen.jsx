import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import { useGlobalStore } from "../../../store/global_store";
import TranscationItem from "./txn_item";
import ChevronLeft from "../../../../assets/svg/chevron_left";
import { horizontalScale, verticalScale } from "../../../utils/dimensions";

export default function TransactionDetailsScreen({ route }) {
  const users = useGlobalStore((state) => state.selectedGroupUsers);
  const nav = useNavigation();
  paymentMap = route.params.paymentMap;
  txnNote = route.params.note;

  function getUser(id) {
    console.log(id);
    console.log(users);
    return users.find((user) => user.id.toString() === id.toString());
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>{txnNote}</Text>
      </View>
      <Text style={styles.helperText}> Transaction Details</Text>
      <ScrollView style={styles.balanceList}>
        {Object.keys(paymentMap).map((key) => {
          const user = getUser(key);
          return (
            <TranscationItem
              key={key}
              username={user.username}
              amount={paymentMap[key]}
              avatar={user.image}
            />
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
