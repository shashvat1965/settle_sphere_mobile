import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storageMiddleware } from "../storage/zustand_mmkv_middleware";

export const useGlobalStore = create(
  persist(
    (set) => ({
      name: "",
      setName: (newName) =>
        set({
          name: newName,
        }),

      jwt: "",
      setJwt: (newJwt) => set({ jwt: newJwt }),

      netAmount: 0.0,
      setNetAmount: (newAmount) => set({ netAmount: newAmount }),

      pubKey: "",
      setPubKey: (newKey) => set({ pubKey: newKey }),

      profilePictureUrl: null,
      setProfilePictureUrl: (newUrl) => set({ profilePictureUrl: newUrl }),

      groups: null,
      setGroups: (newGroups) => set({ groups: newGroups }),

      selectedGroupCode: null,
      setSelectedGroupCode: (newCode) => set({ selectedGroupCode: newCode }),

      selectedGroupUsers: null,
      setSelectedGroupUsers: (newUsers) =>
        set({ selectedGroupUsers: newUsers }),

      txnHistory: null,
      setTxnHistory: (newHistory) => set({ txnHistory: newHistory }),
    }),
    {
      storage: createJSONStorage(() => storageMiddleware),
      name: "global_storage",
      partialize: (state) => ({
        name: state.name,
        jwt: state.jwt,
        profilePictureUrl: state.profilePictureUrl,
      }),
    }
  )
);
