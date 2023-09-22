import { useStytchUser } from "@stytch/react";
import { makeAutoObservable, observable } from "mobx";
import { FC, createContext, useEffect } from "react";
import axiosInstance from "../utils/axios-instance";

type RemainingDownloads = {
  free: number;
  paid: number;
};

class User {
  public userId: string | null = null;
  public referralCode: string | null = null;
  public remainingDownloads: RemainingDownloads = {
    free: 0,
    paid: 0,
  };

  constructor() {
    makeAutoObservable(this, {
      userId: observable,
      referralCode: observable,
      remainingDownloads: observable,
    });
  }

  async getRemainingDownloads() {
    try {
      const res = await axiosInstance.post("/api/usage/remaining-downloads", {
        userId: this.userId,
      });
      this.remainingDownloads.free = res.data.free;
    } catch (error) {
      console.error("Error in getting remaining downloads", error);
    }
  }

  setUserId(id: string) {
    this.userId = id;
  }

  setReferralCode(code: string) {
    this.referralCode = code;
  }
}

export const userClass = new User();

type Props = {
  children: React.ReactNode;
};

export const UserContext = createContext<User>(userClass);

const UserContextProvider: FC<Props> = ({ children }) => {
  const stytchUser = useStytchUser();

  useEffect(() => {
    const init = async () => {
      if (stytchUser.user?.phone_numbers[0].phone_number) {
        try {
          const data = {
            phone: stytchUser.user?.phone_numbers[0].phone_number,
          };
          const response = await axiosInstance.post("/api/user/me", data);
          userClass.setUserId(response.data.user.userId);
          userClass.setReferralCode(response.data.user.referral_code);
          console.log("User id set", userClass.userId);
        } catch (error) {
          console.error("Error in getting user", error);
        }
      }
    };
    init();
  }, [stytchUser.user?.phone_numbers]);

  return (
    <UserContext.Provider value={userClass}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
