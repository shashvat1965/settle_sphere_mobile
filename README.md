# Settle Sphere 

This is the official repository of the mobile app of Settle Sphere. Settle Sphere is an app that can be used to split and clear bills among friends.

This dApp is only fully functional on Android. [Download Here](https://drive.google.com/file/d/1_LxPjS462NksnU9FZ8EJ34IqeGyiHeaz/view?usp=drive_link)

## Features of the App
- Allows user to create an account by connecting to their Solana Wallet
- Create Groups and share the invite code so that other people can join
- Create transactions in the group that can be split either equally or in a custom fashion
- Settle the transactions by paying the amount to the person who is owed the money directly from within the app
- Track various statistics inside each group like total amount spent, total amount owed, etc.

## Featured Libarires
- [React Native](https://reactnative.dev) for making the app
- [Mobile Wallet Adapter](https://github.com/solana-mobile/mobile-wallet-adapter/tree/main/js/packages/mobile-wallet-adapter-protocol) for connecting to wallets and signing transactions/messages
- [web3.js](https://solana-labs.github.io/solana-web3.js/) for constructing transactions and an RPC `connection` client.
- [Zustand](https://zustand-demo.pmnd.rs/) for state management in the app
- [React Navigation](https://reactnavigation.org) for navigation in the app
- [MMKV Storage](https://github.com/mrousavy/react-native-mmkv) for local storage

## Building the Project Locally
### Prerequisites

If you haven't set up a React Native development environment for Android, you'll need to do that first. Follow the [Prerequisite Setup Guide](https://docs.solanamobile.com/getting-started/development-setup).

Follow the guide to make sure you:
- setup your Android and React Native development environment.
- have an Android device or emulator.
- install an MWA compliant wallet app on your device/emulator.
   
### Setting up the project
1. Clone the project
```
git clone https://github.com/shashvat1965/settle_sphere_mobile.git
```
2. Install dependencies
- `yarn install` or `npm install`
3. Launch the app on your Android device/emulator
- `npx react-native run-android`

## License
 ```     
         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
                    Version 2, December 2004 

Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

Everyone is permitted to copy and distribute verbatim or modified
copies of this license document, and changing it is allowed as long
as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE 
TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

0. You just DO WHAT THE FUCK YOU WANT TO.
```

## Reaching Out
If you have any questions or suggestions, feel free to reach out to us at [twitter](https://twitter.com/0x__carnage)



