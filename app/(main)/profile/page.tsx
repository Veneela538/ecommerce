import { getUserDetails } from "@/actions/user-details/get-user-details";
import Profile from "@/components/header/profile";

const profile = async () => {
  const { data: userDetailsResponse } = await getUserDetails();
  return <Profile userDetailsResponse={userDetailsResponse} />;
};

export default profile;
