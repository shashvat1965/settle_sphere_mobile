import {
  ConnectionProvider,
  RPC_ENDPOINT,
} from "./src/solana_providers/ConnectionProvider";
import { clusterApiUrl } from "@solana/web3.js";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { AuthorizationProvider } from "./src/solana_providers/AuthorizationProvider";
import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/home_screen/home";
import GroupScreen from "./src/screens/group_screens/group_screen";
import CreateGroupScreen from "./src/screens/create_group/create_group";
import TotalsScreen from "./src/screens/group_screens/totals/totals_screen";
import CreateTransactionScreen from "./src/screens/group_screens/create_transaction/create_transaction_screen";
import SelectTxnScreen from "./src/screens/group_screens/settle_screens/select_txn_screen/select_txn_screen";
import SettleBalanceScreen from "./src/screens/group_screens/settle_screens/settle_balance_screen/settle_balance_screen";
import LoginScreen from "./src/screens/login_screen/login";
import JoinGroupScreen from "./src/screens/join_group/join_group";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <ConnectionProvider
        config={{ commitment: "processed" }}
        endpoint={clusterApiUrl(RPC_ENDPOINT)}
      >
        <AuthorizationProvider>
          <SafeAreaView style={styles.shell}>
            <Stack.Navigator
              screenOptions={{ headerShown: false }}
              initialRouteName={"login"}
            >
              <Stack.Screen name="login" component={LoginScreen} />
              <Stack.Screen name="home" component={HomeScreen} />
              <Stack.Screen name="group" component={GroupScreen} />
              <Stack.Screen name="create_group" component={CreateGroupScreen} />
              <Stack.Screen name="totals" component={TotalsScreen} />
              <Stack.Screen
                name="create_txn"
                component={CreateTransactionScreen}
              />
              <Stack.Screen name="select_txn" component={SelectTxnScreen} />
              <Stack.Screen name={"settle"} component={SettleBalanceScreen} />
              <Stack.Screen name={"join_group"} component={JoinGroupScreen} />
            </Stack.Navigator>
          </SafeAreaView>
        </AuthorizationProvider>
      </ConnectionProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  shell: {
    height: "100%",
  },
});
