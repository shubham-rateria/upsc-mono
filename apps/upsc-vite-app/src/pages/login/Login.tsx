import { StytchLogin, useStytchUser, useStytch } from "@stytch/react";
import { useCallback } from "react";
import styles from "./Login.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios-instance";

export const Login = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();

  console.log({ user });

  const logout = useCallback(async () => {
    await stytchClient.session.revoke();
  }, [stytchClient]);

  const onEvent = async (event: any) => {
    if (event.type === "OTP_AUTHENTICATE") {
      // check if the user with the phone number is allowed
      try {
        const phone = event.data.user.phone_numbers[0].phone_number;
        console.log({ phone });
        await axiosInstance.post("/api/user/allow-beta-user", {
          phone,
        });
        navigate("/search");
      } catch (error) {
        console.error("beta check error", error);
        logout();
      }
    }
  };

  const stytchProps = {
    config: {
      products: ["otp"],
      otpOptions: {
        methods: ["sms"],
      },
    },
    styles: {
      hideHeaderText: true,
      container: { borderColor: "transparent" },
      colors: { primary: "#614fcc" },
      fontFamily: '"Mulish", Helvetica, sans-serif',
      buttons: {
        primary: {
          backgroundColor: "rgba(73, 59, 153, 1)",
        },
      },
    },
    callbacks: {
      onEvent,
      onSuccess: (message: any) => console.log({ success: message }),
      onError: (message: any) => console.log(message),
    },
  };

  useEffect(() => {
    if (user.user) {
      navigate("/search");
    }
  }, []);

  return (
    <div className={styles.Container}>
      <h1>Login with OTP</h1>
      <StytchLogin
        // @ts-ignore
        config={stytchProps.config}
        styles={stytchProps.styles}
        callbacks={stytchProps.callbacks}
      />
    </div>
  );
};
