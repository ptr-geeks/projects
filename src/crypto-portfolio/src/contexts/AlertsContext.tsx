import React, { useState, createContext, useContext } from "react";
import { functions } from "../helpers/firebase";
import { useToast } from '@chakra-ui/react'
import { getToast } from "../helpers/formatters";
import { httpsCallable } from "firebase/functions";
import { useUser } from "./UserContext";
import { BullFolio } from "bullfolio-types";

interface AlertsProviderProps {
  children: React.ReactNode
}

interface AlertsContextProps {
  createAlert: (alert: BullFolio.Alert) => Promise<void>;
  getAllAlerts: () => Promise<BullFolio.Alert[] | null>;
  deleteAlert: (id: string) => Promise<void>;
}

const AlertsContext = createContext<AlertsContextProps>({
  createAlert: (alert) => new Promise(() => { }),
  getAllAlerts: () => new Promise(() => null),
  deleteAlert: () => new Promise(() => {  }),
});


export const AlertsProvider = ({ children }: AlertsProviderProps) => {

  const { user, userData } = useUser();
  const toast = useToast();

  const [alerts, setAlerts] = useState<BullFolio.Alert[]>([]);

  const createAlert = async (alertData: BullFolio.Alert) => {
    if(!user || !userData) {
      return;
    };

    if(userData.alerts >= 3) {
      return;
    };

    try{
      const createAlertF = httpsCallable(functions, "createAlert");
      const result = await createAlertF({
        alert: alertData
      });
    }catch(err){
      const error: any = err;
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(code, message, details);
      toast(getToast("error", "Something went wrong while getting coins!", message));
    }
  }

  const getAllAlerts = async (): Promise<BullFolio.Alert[] | null> => {
    if(!user || !userData) {
      return null;
    };

    try{
      const getAllUserAlerts = httpsCallable(functions, "getAllUserAlerts");
      const result = await getAllUserAlerts();
      const _alerts = result.data as BullFolio.Alert[];
      setAlerts(_alerts);
      return _alerts;
    }catch(err){
      const error: any = err;
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(code, message, details);
      toast(getToast("error", "Something went wrong while getting coins!", message));
      return null;
    }
  }

  const deleteAlert = async (id: string) => {
    if(user && userData && id) {
      try{
        toast(getToast("info", "Deleting", "Deleting alert, please wait."));
        const deleteAlert = httpsCallable(functions, "deleteAlert");
        await deleteAlert({
          alertId: id
        });
        toast(getToast("success", "Deleted", "Alert was deleted."));
      }catch(err){
        const error: any = err;
        const code = error.code;
        const message = error.message;
        const details = error.details;
        console.log(code, message, details);
        toast(getToast("error", "Something went wrong while getting coins!", message));
      }
    }
  }

  return (
    <AlertsContext.Provider
      value={{
        createAlert,
        getAllAlerts,
        deleteAlert
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  return useContext(AlertsContext);
}