import { getAddress } from "@/actions/address/get-address";
import { getUserDetails } from "@/actions/user-details/get-user-details";
import Profile from "@/components/header/profile";

const profile = async () => {
  const { data: userDetailsResponse } = await getUserDetails();
  const { data: addresses } = await getAddress();
  return (
    <Profile userDetailsResponse={userDetailsResponse} addresses={addresses} />
  );
};

export default profile;
