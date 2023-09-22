import { useStytchUser, useStytch } from "@stytch/react";
import styles from "./Login.module.css";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Button, Input } from "semantic-ui-react";
import axiosInstance from "../../utils/axios-instance";
import { TourContext } from "../../contexts/TourContext";
import { AnalyticsClassContext } from "../../analytics/AnalyticsClass";

function isPhoneNumber(value: string) {
  // Define a regular expression pattern for a phone number with Indian country code +91
  const phoneNumberPattern = /^\+91\d{10}$/;

  // Test the value against the pattern
  return phoneNumberPattern.test(value);
}

const DEFAULT_REFERRAL_CODE = "ME32DA";

export const Login = () => {
  const stytchClient = useStytch();
  const user = useStytchUser();
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState();
  const [resendCodeTimer, setResendCodeTimer] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [methodId, setMethodId] = useState("");
  const [showReferralInput, setShowReferralInput] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const tourContextController = useContext(TourContext);
  const analyticsClass = useContext(AnalyticsClassContext);

  const startCountdown = async () => {
    while (resendCodeTimer > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
      setResendCodeTimer((prevCount) => prevCount - 1);
    }
  };

  const sendPasscode = async () => {
    if (phoneNumber) {
      if (!isPhoneNumber(phoneNumber)) {
        setError(true);
        setErrorMessage("Please enter a valid 10 digit Indian phone number.");
        return;
      }
      setLoading(true);
      const res = await stytchClient.otps.sms.loginOrCreate(phoneNumber, {
        expiration_minutes: 5,
      });
      setResendCodeTimer(30);
      startCountdown();
      setMethodId(res.method_id);
      setLoading(false);
      setOtpSent(true);
      analyticsClass.triggerOtpRequested({
        attempt_number: -1,
        phone_number: phoneNumber,
        refer_code:
          referralCode.length > 0 ? referralCode : DEFAULT_REFERRAL_CODE,
      });
    }
  };

  const submitOtp = async () => {
    setLoading(true);
    try {
      await stytchClient.otps.authenticate(otp, methodId, {
        session_duration_minutes: 10000,
      });
      const userResponse = await axiosInstance.post(
        "/api/user/login-or-create",
        {
          phone: phoneNumber,
        }
      );
      // @ts-ignore
      tourContextController.setPhone(phoneNumber);
      const data = {
        referralCode:
          referralCode.length > 0 ? referralCode : DEFAULT_REFERRAL_CODE,
        userId: userResponse.data.user.userId,
      };
      try {
        await axiosInstance.post("/api/referral/apply", data);
        // console.log("referral applied");
      } catch (error: any) {
        setError(true);
        setErrorMessage(error.response.data.message);
        setLoading(false);
        return;
      }
      analyticsClass.triggerLogin({
        attempt_number: -1,
        phone_number: phoneNumber || "",
        result: "pass",
        refer_code: data.referralCode,
      });
      navigate("/search");
    } catch (error) {
      analyticsClass.triggerLogin({
        attempt_number: -1,
        phone_number: phoneNumber || "",
        result: "fail",
        refer_code: "",
      });
      setError(true);
      setErrorMessage("Please enter the correct OTP.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user.user) {
      try {
        // @ts-ignore
        window.clarity(
          "identify",
          user.user.phone_numbers[0].phone_number,
          null,
          null,
          user.user.phone_numbers[0].phone_number
        );
      } catch (error) {
        console.error(error);
      }
      navigate("/search");
    }
  }, [user.user]);

  return (
    <div className={styles.Container}>
      <div className={styles.InnerContainer}>
        <div className={styles.Logo}>
          <img src={"/img/logo.svg"} alt="Logo" />
        </div>
        {!otpSent && (
          <>
            <div className={styles.Label}>Login with phone number</div>
            <div>
              <PhoneInput
                defaultCountry="IN"
                placeholder="Enter phone number"
                value={phoneNumber}
                // @ts-ignore
                onChange={setPhoneNumber}
                className={styles.Input}
              />
              {showReferralInput && (
                <Input
                  fluid
                  placeholder="Enter referral code"
                  onChange={(e) => {
                    setReferralCode(e.target.value.toUpperCase());
                  }}
                />
              )}
              <Button
                className={styles.ButtonSecondary}
                onClick={() => {
                  if (!showReferralInput) {
                    setShowReferralInput(true);
                  } else {
                    setShowReferralInput(false);
                    setReferralCode("");
                  }
                }}
              >
                {!showReferralInput ? "Enter" : "Remove"} Referral Code
              </Button>
              <Button
                disabled={!isPhoneNumber(phoneNumber || "")}
                onClick={sendPasscode}
                className={styles.Button}
                loading={loading}
              >
                Login with OTP
              </Button>
            </div>
          </>
        )}
        {otpSent && (
          <div>
            <div className={styles.Label}>
              Enter OTP sent to{" "}
              <span className={styles.PhoneNumber}>{phoneNumber}</span>
            </div>
            <div className={styles.Input}>
              <input
                id="otp-input"
                autoComplete="one-time-code"
                type="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  setOtp(e.target.value.toString());
                }}
              />
            </div>
            <div>
              <Button
                className={styles.Button}
                onClick={submitOtp}
                loading={loading}
              >
                Submit OTP
              </Button>
            </div>
            <div>
              <Button
                className={styles.ButtonSecondary}
                onClick={sendPasscode}
                disabled={resendCodeTimer > 0}
              >
                Resend OTP{" "}
                {Math.max(0, resendCodeTimer) > 0 ? (
                  <span>in {resendCodeTimer}s</span>
                ) : (
                  ""
                )}
              </Button>
            </div>
          </div>
        )}
        {error && <div className={styles.Error}>{errorMessage}</div>}
      </div>
    </div>
  );
};
