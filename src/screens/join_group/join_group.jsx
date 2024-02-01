import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import ChevronLeft from "../../../assets/svg/chevron_left";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../utils/dimensions";
import { useGlobalStore } from "../../store/global_store";

export default function JoinGroupScreen() {
  const nav = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);
  const [code, setCode] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const joinGroup = async () => {
    if (code === null || code === "") return;
    setLoading(true);
    var body = {
      group_code: code,
    };
    console.log(body);
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups/join",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer" + jwt,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    console.log(response);
    const text = await response.text();
    console.log(text);
    try {
      const json = JSON.parse(text);
      if (response.status !== 200) {
        if (text.message !== null) {
          ToastAndroid.show(json.message, ToastAndroid.SHORT);
          setLoading(false);
          return;
        }
        ToastAndroid.show("Error joining group", ToastAndroid.SHORT);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error.message != null)
        ToastAndroid.show(error.message, ToastAndroid.SHORT);
      else ToastAndroid.show("Error joining group", ToastAndroid.SHORT);
    }
  };

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
        <Text style={styles.headingText}>Join a Group</Text>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.textFieldColumn}>
          <Text style={styles.txtFieldHeading}> Group Code</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#747474"
            style={styles.groupInput}
            textAlignVertical="bottom"
            onChange={(event) => {
              setCode(event.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View
        style={styles.createBtn}
        onTouchEnd={() => {
          joinGroup().then((res) => {
            setLoading(false);
            nav.goBack();
          });
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.createTxt}>Join</Text>
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
    backgroundColor: "#0382EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    paddingVertical: verticalScale(10),
    marginTop: verticalScale(40),
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
    fontSize: 16,
  },
  textFieldColumn: {
    flex: 1,
  },
  groupInput: {
    fontSize: 16,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Medium",
  },
});
