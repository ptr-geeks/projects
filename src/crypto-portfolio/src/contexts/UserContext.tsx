import React, { useState, createContext, useContext, useEffect } from "react";
import { auth, functions } from "../helpers/firebase";
import { onAuthStateChanged, updateEmail, updatePassword, signInWithEmailAndPassword, sendEmailVerification, createUserWithEmailAndPassword } from "@firebase/auth";
import { User } from "@firebase/auth";
import { useToast } from '@chakra-ui/react'
import { getToast } from "helpers/formatters";
import { httpsCallable } from "firebase/functions";
import { BullFolio } from "bullfolio-types";

interface UserProviderProps {
  children: React.ReactNode
}

interface UserContextProps {
  isSignedIn: boolean,
  user: User | null,
  userData: BullFolio.User | null,
  signIn: () => void,
  signOut: () => void,
  saveEmail: (newEmail: string) => void,
  changePassword: (newPassword: string) => void,
  signInWithPassword: (email: string, password: string) => void,
  signUpWithPassword: (email: string, password: string) => void,
  verifyEmail: () => void,
  getIsVerified: () => Promise<boolean>,
  refreshUser: () => Promise<User | null>,
  setBaseCurrency: (currency: BullFolio.MainCurrencies) => Promise<void>,
  editBundles: (bundles: { [name: string]: BullFolio.User.AddressBundle }) => Promise<void>
}

const UserContext = createContext<UserContextProps>({
  isSignedIn: false,
  user: null,
  userData: null,
  signIn: () => { },
  signOut: () => { },
  saveEmail: (newEmail: string) => { },
  changePassword: (newPassword: string) => { },
  signInWithPassword: (email: string, password: string) => { },
  signUpWithPassword: (email: string, password: string) => { },
  verifyEmail: () => { },
  getIsVerified: () => new Promise(() => false),
  refreshUser: () => new Promise(() => null),
  setBaseCurrency: () => new Promise(() => {  }),
  editBundles: (bundles) => new Promise(() => {  }),
});


export const UserProvider = ({ children }: UserProviderProps) => {

  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<BullFolio.User | null>(null);

  const toast = useToast();

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, async(user) => {
      setUser(user);
      if(user) setIsSignedIn(true);
      else setIsSignedIn(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    if(user) {
      (async () => {
        await getUserData();
      })();
    }
  }, [user]);

  const getUserData = async() => {
    if(!user) return null;

    try{
      console.log("getting")
      const getUserDataF = httpsCallable(functions, "getUserData");
      const result = await getUserDataF();
      const data = result.data as BullFolio.User;
      console.log("result ", data);
      setUserData(data);
      return data;
    }catch(err){
      const error: any = err;
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(code, message, details);
      toast(getToast("error", "Something went wrong while getting user data!", message));
      return null;
    }
  }

  const setBaseCurrency = async (currency: BullFolio.MainCurrencies) => {
    if (user) {
      try{
        toast(getToast("info", "Saving!", "PLease wait..."));
        const updateBaseCurrencyF = httpsCallable(functions, "updateBaseCurrency");
        await updateBaseCurrencyF({
          baseCurrency: currency
        });
        const prev = {...userData};
        prev.baseCurrency = currency;
        setUserData(prev);
        toast(getToast("success", "Saved!", "Saved successfully."));
      }catch(err){
        const error: any = err;
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log(code, message, details);
        toast(getToast("error", "Something went wrong while getting user data!", message));
      }
    }else{
      toast(getToast("warning", "Sign in first!", "Sign in first to update base currency."));
    }
  };

  const signIn = async() => {
    try{
      toast(getToast("info", "Loading!", "Signing in . . ."));

      toast.closeAll();
      toast(getToast("success", "Signed In!", "You have signed in successfully!"));
    }catch(error: any){
      toast(getToast("error", "Error!", error.message))
      throw new Error(error);
    }
  }

  const signOut = async() => {
    try{
      await auth.signOut();
      toast(getToast("success", "Signed Out!", "You have signed out successfully!"));
    }catch(error: any){
      toast(getToast("error", "Error!", "Something went wrong while signing you out."))
      throw new Error(error);
    }
  }

  const saveEmail = async(newEmail: string) => {
    if(auth.currentUser && newEmail) {
      await updateEmail(auth.currentUser, newEmail).then(() => {
        toast(getToast("success", "Email Updated!", "Your email was updated successfully!"));
        const _user = auth.currentUser;
        setUser(_user);
      }).catch((error: any) => {
        toast(getToast("error", "Error!", error.message));
        throw new Error(error);
      });
    }
  }

  const changePassword = async(newPassword: string) => {
    try{
      await updatePassword(user, newPassword);
      toast(getToast("success", "Password Updated!", "Your password has been updated successfully!"));
    }catch(error: any){
      toast(getToast("error", "Something went wrong!", error.message))
      throw new Error(error);
    }
  }

  const signInWithPassword = async(email: string, password: string) => {
    try{
      toast(getToast("info", "Loading!", "Signing in . . ."));
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("SIGNED IN");
      toast(getToast("success", "Signed In!", "You have signed in successfully!"));
      setUser(user);
      console.log(user);
    }catch(err){
      const error: any = err;
      const errorCode = error.code;
      const errorMessage = error.message;
      toast(getToast("error", "Something went wrong!", errorMessage))
      console.log("ERROR")
      console.log(errorCode, errorMessage);
      throw new Error(error)
    }
  }

  const signUpWithPassword = async(email: string, password: string) => {
    try{
      toast(getToast("info", "Loading!", "Signing Up . . ."));
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast(getToast("success", "Signed Up!", "You have signed up successfully!"));
      setUser(user);
      console.log(user);
    }catch(err){
      const error: any = err;
      const errorCode = error.code;
      const errorMessage = error.message;
      toast(getToast("error", "Something went wrong!", errorMessage))
      console.log("ERROR")
      console.log(errorCode, errorMessage);
      throw new Error(error)
    }
  }
  
  const verifyEmail = () => {
    if(user) {
      sendEmailVerification(user)
      .then(() => {
        toast(getToast("success", "Email Sent!", "Follow instructions in that email!"));
      });
    }
  }

  const getIsVerified = async() => {
    await user?.reload();
    const _user = await auth.currentUser;
    setUser(_user);
    if(_user){
      var status = _user.emailVerified;
      if(status) return true;
      else return false;
    }else{
      return false
    } 
  }

  const refreshUser = async() => {
    await user?.reload();
    const _user = await auth.currentUser;
    setUser(_user);
    return _user;
  };

  const editBundles = async (bundles: { [name: string]: BullFolio.User.AddressBundle }) => {
    if(user && userData?.addressBundles !== bundles) {
      try{
        toast(getToast("info", "Saving", "Saving changes, wait..."));
        const createAddressBundleF = httpsCallable(functions, "createAddressBundle");
        await createAddressBundleF({
          addressBundles: bundles
        });
        setUserData({...userData, addressBundles: bundles});
        toast(getToast("success", "Saved", "Changes Saved!"));
        setUser(user);
        console.log(user);
      }catch(err){
        const error: any = err;
        const errorMessage = error.message;
        toast(getToast("error", "Something went wrong!", errorMessage))
        throw new Error(error)
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        isSignedIn,
        user,
        userData,
        signIn,
        signOut,
        saveEmail,
        changePassword,
        signInWithPassword,
        signUpWithPassword,
        verifyEmail,
        getIsVerified,
        refreshUser,
        setBaseCurrency,
        editBundles
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
}