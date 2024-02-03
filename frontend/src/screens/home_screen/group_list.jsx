import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

export default function GroupList() {
  const jwt = useGlobalStore((state) => state.jwt);
  const groups = useGlobalStore((state) => state.groups);
  const setGroups = useGlobalStore((state) => state.setGroups);
  const setCode = useGlobalStore((state) => state.setSelectedGroupCode);
  const [isLoading, setLoading] = useState(true);
  const nav = useNavigation();

  const fetchGroups = async () => {
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups",
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
      setGroups(data.groups);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchGroups();

      return () => {};
    }, [])
  );

  function textFromStatus(amount) {
    amount = amount.toFixed(2);
    if (amount < 0) {
      return "You are owed " + -1 * amount;
    } else if (amount >= 0) {
      return "You owe " + amount;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>Your Groups</Text>
      <View style={styles.groupCardList}>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <FlatList
            scrollEnabled={true}
            data={groups}
            keyExtractor={(item) => {
              return item.code;
            }}
            renderItem={(item) => {
              return (
                <View style={styles.outerContainer}>
                  <Text style={styles.groupName}> {item.item.name} </Text>
                  <View style={styles.innerContainer}>
                    <Image
                      source={{ uri: item.item.image }}
                      style={styles.groupImage}
                    />
                    <View style={styles.groupInfo}>
                      <View style={styles.amountWrapper}>
                        <Text style={styles.groupAmountText}>
                          {textFromStatus(item.item.net_amount)}
                        </Text>
                        <Image
                          source={require("../../../assets/png/solana.png")}
                          style={{ height: 22, width: 22 }}
                        />
                      </View>
                      <View style={{ flex: 1 }} />
                      <View
                        style={styles.viewBtn}
                        onTouchEnd={() => {
                          setCode(item.item.code);
                          nav.navigate("group");
                        }}
                      >
                        <Text style={styles.viewTxt}>View</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(33),
    flexDirection: "column",
    width: "100%",
  },
  headingText: {
    color: "white",
    fontSize: 24,
    paddingLeft: horizontalScale(7),
    fontFamily: "BeVietnamPro-ExtraBold",
  },
  groupCardList: {
    width: "100%",
    marginTop: verticalScale(20),
    height: verticalScale(500),
  },
  outerContainer: {
    paddingTop: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
    borderRadius: 12,
    backgroundColor: "#131313",
    marginBottom: verticalScale(12),
  },
  groupName: {
    color: "white",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  innerContainer: {
    paddingVertical: verticalScale(23),
    paddingHorizontal: horizontalScale(15),
    marginTop: verticalScale(18),
    marginBottom: verticalScale(22),
    backgroundColor: "#161620",
    borderRadius: 7.5,
    flexDirection: "row",
  },
  groupImage: {
    width: horizontalScale(110),
    height: verticalScale(123),
    borderRadius: 4,
  },
  groupInfo: {
    flex: 1,
    marginLeft: horizontalScale(9),
    justifyContent: "space-between",
  },
  amountWrapper: {
    backgroundColor: "#232834",
    borderRadius: 6,
    paddingVertical: verticalScale(9),
    paddingHorizontal: horizontalScale(9),
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  groupAmountText: {
    color: "white",
    fontSize: 14,
    fontFamily: "BeVietnamPro-Medium",
  },
  viewBtn: {
    backgroundColor: "#0382EB",
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: verticalScale(8),
  },
  viewTxt: {
    color: "white",
    fontSize: 14,
    fontFamily: "BeVietnamPro-SemiBold",
  },
});
