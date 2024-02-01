import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Image,
  TextInput,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import ChevronLeft from "../../../../../assets/svg/chevron_left";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { horizontalScale, verticalScale } from "../../../../utils/dimensions";
import { useConnection } from "../../../../solana_providers/ConnectionProvider";
import { transact } from "@solana-mobile/mobile-wallet-adapter-protocol-web3js";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { useAuthorization } from "../../../../solana_providers/AuthorizationProvider";
import { useGlobalStore } from "../../../../store/global_store";

export default function SettleBalanceScreen({ route }) {
  const avatarUrlPayer = route.params.payerUrl;
  const avatarUrlReceiver = route.params.receiverUrl;
  const pubKeyPayer = route.params.pubKeyPayer;
  const pubKeyReceiver = route.params.pubKeyReceiver;
  const userId = route.params.userId;
  const status = route.params.status;
  const amount = route.params.amount.toFixed(2);
  const code = useGlobalStore((state) => state.selectedGroupCode);
  const jwt = useGlobalStore((state) => state.jwt);
  const nav = useNavigation();
  const { connection } = useConnection();
  const { authorizeSession } = useAuthorization();
  const [isLoading, setLoading] = useState(false);

  function solToLamports() {
    return amount * LAMPORTS_PER_SOL;
  }
  const settleBalance = async () => {
    setLoading(true);
    const signedTxn = await transact(async (wallet) => {
      const [authorizationResult, latestBlockhash] = await Promise.all([
        authorizeSession(wallet),
        connection.getLatestBlockhash(),
      ]);
      console.log(pubKeyReceiver);
      const randomTransferTransaction = new Transaction({
        ...latestBlockhash,
        feePayer: authorizationResult.publicKey,
      }).add(
        SystemProgram.transfer({
          fromPubkey: authorizationResult.publicKey,
          toPubkey: pubKeyReceiver,
          lamports: solToLamports(),
        })
      );

      const signedTransactions = await wallet.signTransactions({
        transactions: [randomTransferTransaction],
      });

      return signedTransactions[0];
    });

    console.log(signedTxn);
    const txSignature = await connection.sendRawTransaction(
      signedTxn.serialize()
    );

    const confirmationResult = await connection.confirmTransaction(
      txSignature,
      "confirmed"
    );

    if (confirmationResult.value.err) {
      setLoading(false);
      ToastAndroid.show("Transaction failed", ToastAndroid.SHORT);
      throw new Error(JSON.stringify(confirmationResult.value.err));
    } else {
      ToastAndroid.show("Transaction successful!", ToastAndroid.SHORT);
      console.log("Transaction successfully submitted!");
    }
  };

  async function settleTxn() {
    setLoading(true);
    console.log(userId);
    const response = await fetch(
      "https://bits-dvm.org/settlesphere/api/v1/txn/group/" +
        code +
        "/settle/" +
        userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
      }
    );
    const text = await response.text();
    console.log(text);
    try {
      const data = JSON.parse(text);
      setLoading(false);
      console.log(data);
      nav.goBack();
    } catch (error) {
      ToastAndroid.show("Settling failed", ToastAndroid.SHORT);
      setLoading(false);
      console.error("JSON Parsing Error:", error);
    }
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topBar}>
        <Pressable onPress={() => nav.goBack()}>
          <ChevronLeft />
        </Pressable>
        <Text style={styles.headingText}>Group Name</Text>
      </View>
      <Text style={styles.helperText}>Record Payment</Text>
      <View style={styles.paymentInfo}>
        <View style={styles.pubKeyCol}>
          <Image source={{ uri: avatarUrlPayer }} style={styles.avatar} />
          <Text
            ellipsizeMode={"middle"}
            numberOfLines={1}
            style={styles.pubKey}
          >
            {pubKeyPayer}
          </Text>
        </View>
        <Text style={styles.payText}>Pay</Text>
        <View style={styles.pubKeyCol}>
          <Image source={{ uri: avatarUrlReceiver }} style={styles.avatar} />
          <Text
            ellipsizeMode={"middle"}
            numberOfLines={1}
            style={styles.pubKey}
          >
            {pubKeyReceiver}
          </Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.noteLogoContainer}>
          <Image source={require("../../../../../assets/png/solana.png")} />
        </View>
        <View style={styles.textFieldColumn}>
          <TextInput
            placeholder={amount.toString()}
            placeholderTextColor="white"
            style={styles.input}
            textAlignVertical="bottom"
            keyboardType={"numeric"}
            editable={false}
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        {status === 1 ? (
          <View />
        ) : (
          <Pressable>
            <View style={styles.buttonContainerPay} onTouchEnd={async () => {
              try {
                await settleBalance();
              } catch (e) {
                console.log(e);
                setLoading(false);
                ToastAndroid.show("Error", ToastAndroid.SHORT)
              }
            }}>
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <Text style={styles.buttonText}>Pay Using Wallet</Text>
              )}
            </View>
          </Pressable>
        )}
        <Pressable>
          <View style={styles.buttonContainer} onTouchEnd={settleTxn}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>Settle</Text>
            )}
          </View>
        </Pressable>
      </View>
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
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 48,
  },
  avatar: {
    height: verticalScale(100),
    width: horizontalScale(100),
    borderRadius: 10,
  },
  payText: {
    marginTop: verticalScale(40),
    fontFamily: "BeVietnamPro-Bold",
    color: "white",
    fontSize: 18,
    marginHorizontal: horizontalScale(18),
  },
  pubKeyCol: {
    flexDirection: "column",
    alignItems: "center",
  },
  pubKey: {
    width: horizontalScale(65),
    marginTop: verticalScale(20),
    fontFamily: "BeVietnamPro-Regular",
    color: "white",
  },
  detailsRow: {
    marginTop: verticalScale(32),
    flexDirection: "row",
    alignItems: "center",
  },
  noteLogoContainer: {
    height: verticalScale(60),
    width: horizontalScale(60),
    borderColor: "#0382EB",
    borderWidth: 1,
    backgroundColor: "#373A40",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  textFieldColumn: {
    marginLeft: horizontalScale(16),
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: "white",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    fontFamily: "BeVietnamPro-Medium",
  },
  buttonContainer: {
    marginTop: verticalScale(32),
    backgroundColor: "#0382EB",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    width: "100%",
  },
  buttonWrapper: {
    position: "absolute",
    bottom: verticalScale(60),
    left: horizontalScale(25),
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BeVietnamPro-Medium",
  },
  buttonContainerPay: {
    marginTop: verticalScale(32),
    backgroundColor: "#0382EB33",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0382EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(12),
    width: "100%",
  },
});
