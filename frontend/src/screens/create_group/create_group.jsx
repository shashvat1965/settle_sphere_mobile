import {
  ActivityIndicator,
  Image,
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
import * as ImagePicker from "react-native-image-picker";
import { useGlobalStore } from "../../store/global_store";

export default function CreateGroupScreen() {
  const nav = useNavigation();
  const jwt = useGlobalStore((state) => state.jwt);

  const [uri, setUri] = useState(null);
  const [name, setName] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      console.log("Response = ", response.assets);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else {
        const source = response.assets[0].uri;
        setUri(source);
        console.log("response", JSON.stringify(response));
      }
    });
  };

  const createGroup = async () => {
    if (name === null || name === "") {
      ToastAndroid.show("Please enter a name", ToastAndroid.SHORT);
      return;
    }
    if (uri === null) {
      ToastAndroid.show("Please select an image", ToastAndroid.SHORT);
      return;
    }
    setLoading(true);
    const body = new FormData();
    body.append("name", name);
    console.log("uri:", uri);
    if (uri) {
      body.append("image", {
        uri: uri,
        name: "image.jpg",
        type: "image/jpeg",
      });
    }
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/groups",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer" + jwt,
          "Content-Type": "multipart/form-data",
        },
        body: body,
      }
    );
    const text = await response.text();
    console.log(text);
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON Parsing Error:", error);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            setUri(null);
            nav.goBack();
          }}
        >
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>Create a Group</Text>
      </View>
      <View style={styles.detailsRow}>
        {uri !== null ? (
          <Pressable onPress={launchImageLibrary}>
            <Image source={{ uri: uri }} style={styles.img} />
          </Pressable>
        ) : (
          <View style={styles.addImgBtn} onTouchEnd={launchImageLibrary}>
            <Image
              source={require("../../../assets/png/add_image.png")}
              style={{ height: verticalScale(31), width: horizontalScale(31) }}
            />
          </View>
        )}
        <View style={styles.textFieldColumn}>
          <Text style={styles.txtFieldHeading}> Group Name</Text>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#747474"
            style={styles.groupInput}
            textAlignVertical="bottom"
            onChange={(event) => {
              setName(event.nativeEvent.text);
            }}
          />
        </View>
      </View>
      <View
        style={styles.createBtn}
        onTouchEnd={() => {
          if (isLoading === true) return;
          createGroup().then(() => {
            setLoading(false);
            nav.goBack();
          });
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <Text style={styles.createTxt}>Create</Text>
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
    marginLeft: horizontalScale(16),
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
