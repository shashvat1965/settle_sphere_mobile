import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ChevronLeft from "../../../assets/svg/chevron_left";
import React, { useEffect, useState } from "react";
import { useNavigation, StackActions } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";
import SolanaLogo from "../../../assets/svg/solana";

export default function ProfileScreen() {
  const nav = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);
  const uri = useGlobalStore((state) => state.profilePictureUrl);
  const publicKey = useGlobalStore((state) => state.pubKey);
  const setJwt = useGlobalStore((state) => state.setJwt);
  const [spending, setSpending] = useState("");

  const name = useGlobalStore((state) => state.name);
  const [isLoading, setLoading] = useState(false);

  const fetchStat = async () => {
    setLoading(true);
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups/user/stats",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer" + jwt,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      setSpending("Error!");
      setLoading(false);
    }
    const text = await response.text();
    console.log(text);
    try {
      return JSON.parse(text);
    } catch (error) {
      setSpending("Error!");
      setLoading(false);
      console.error("JSON Parsing Error:", error);
    }
  };

  useEffect(() => {
    fetchStat().then((res) => {
      setSpending(res.lifetime_spending);
      console.log(spending);
      setLoading(false);
    });
  }, []);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            nav.goBack();
          }}
        >
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>Profile</Text>
      </View>
      <View style={styles.detailsRow}>
        <Image source={{ uri: uri }} style={styles.img} />
        <View style={styles.textFieldColumn}>
          <Text style={styles.txtFieldHeading}>{name}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={"middle"}
            style={styles.groupInput}
          >
            {publicKey}
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flex: 1 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <View style={styles.stat}>
            <Text style={styles.statName}>
              Lifetime Spending on SettleSphere
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 23,
                width: "100%",
              }}
            >
              <View style={styles.logoBox}>
                <SolanaLogo />
              </View>
              <Text style={styles.statValue}>{spending}</Text>
            </View>
          </View>
          <View style={{ flex: 1 }} />
        </>
      )}
      <View
        style={styles.createBtn}
        onTouchEnd={() => {
          setJwt("");
          nav.navigate("login");
        }}
      >
        <Text style={styles.createTxt}>Log Out</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "#161620",
    height: "100%",
    display: "flex",
    alignItems: "center",
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
    fontFamily: "BeVietnamPro-ExtraBold",
    color: "white",
    fontSize: 24,
    marginLeft: horizontalScale(8),
  },
  createBtn: {
    width: "100%",
    backgroundColor: "#FF3535",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(40),
    marginBottom: verticalScale(60),
  },
  createTxt: {
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 16,
  },
  detailsRow: {
    marginTop: verticalScale(40),
    flexDirection: "row",
    alignItems: "center",
  },
  addImgBtn: {
    paddingVertical: verticalScale(33),
    paddingHorizontal: horizontalScale(33),
    borderColor: "#0382EB",
    borderWidth: 1,
    backgroundColor: "#373A40",
    borderRadius: 4,
  },
  img: {
    height: verticalScale(97),
    width: verticalScale(97),
    borderRadius: 4,
  },
  txtFieldHeading: {
    fontFamily: "BeVietnamPro-Medium",
    color: "white",
    fontSize: 24,
  },
  textFieldColumn: {
    marginLeft: horizontalScale(16),
    flex: 1,
  },
  groupInput: {
    paddingTop: verticalScale(16),
    fontSize: 16,
    color: "white",
    fontFamily: "BeVietnamPro-Regular",
  },
  stat: {
    marginTop: verticalScale(40),
    gap: verticalScale(15),
  },
  statName: {
    fontFamily: "BeVietnamPro-Medium",
    color: "white",
    fontSize: 18,
  },
  logoBox: {
    padding: 15,
    borderColor: "#0382EB",
    borderWidth: 0.5,
    backgroundColor: "#373A40",
    borderRadius: 4,
  },
  statValue: {
    fontSize: 18,
    color: "white",
    borderBottomWidth: 1,
    paddingBottom: 10,
    flex: 1,
    alignSelf: "flex-end",
    textAlign: "auto",
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Medium",
  },
});
