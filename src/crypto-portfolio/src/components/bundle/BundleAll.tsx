import Loading from "components/Loading/Loading";
import { useUser } from "contexts/UserContext";
import { useHistory } from "react-router-dom";
import SelectBundle from "./SelectBundle";
import { useEffect, useState } from "react";
import { BullFolio } from "bullfolio-types";
import { useQuery } from "helpers/formatters";
import CurrentBundle from "./CurrentBundle";

const BundleAll = (props: { setBundle: (bundle: BullFolio.User.AddressBundle) => void }) => {
  const { setBundle } = props;
  const { userData } = useUser();
  const history = useHistory();
  const query = useQuery();

  const [bundle, set_Bundle] = useState<BullFolio.User.AddressBundle | null>(null);

  const onSelect = (bundle: BullFolio.User.AddressBundle) => {
    history.push(`?bundleId=${bundle.id}`);
  }

  useEffect(() => {
    const bundleId = query.get("bundleId");
    if(bundleId && userData) {
      const _bundle = userData.addressBundles[bundleId];
      if(_bundle) {
        set_Bundle(_bundle);
        setBundle(_bundle)
      }else{
        console.log("bundle not found");
      }
    }
  }, [query, userData]);

  return(
    <>
      {userData && bundle ? (
        <CurrentBundle
          id={bundle.id}
          userData={userData}
          handleChange={onSelect}
        />
      ):null}

      {userData && !bundle ? (
        <SelectBundle
          onSelect={onSelect}
          userData={userData}
        />
      ):null}

      {!userData ? (
        <Loading text="Loading Bundle ..." />
      ):null}
    </>
  );
};

export default BundleAll;