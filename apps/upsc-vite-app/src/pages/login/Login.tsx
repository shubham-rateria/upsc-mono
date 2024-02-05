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
import { UserContext } from "../../contexts/UserContextProvider";
import { Carousel } from "react-responsive-carousel";

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
  const userClass = useContext(UserContext);

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
      userClass.setUserId(userResponse.data.user.userId);
      userClass.setReferralCode(userResponse.data.user.referral_code);
      // @ts-ignore
      tourContextController.setPhone(phoneNumber);
      const data = {
        referralCode:
          referralCode.length > 0 ? referralCode : DEFAULT_REFERRAL_CODE,
        userId: userResponse.data.user.userId,
      };
      try {
        await axiosInstance.post("/api/referral/apply", data);
        analyticsClass.triggerReferralCodeAdded({
          referral_code: data.referralCode,
          applied: true,
        });
        // console.log("referral applied");
      } catch (error: any) {
        setError(true);
        setErrorMessage(error.response.data.message);
        setLoading(false);
        analyticsClass.triggerReferralCodeAdded({
          referral_code: data.referralCode,
          applied: false,
        });
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
      <div className={styles.Showcase}>
        <video src="/demo/full-demo.mp4" autoPlay muted />
        <Carousel
          showStatus={false}
          showThumbs={false}
          showArrows={true}
          autoPlay={true}
        >
          <div className={styles.CarouselCard}>
            <h1 className={styles.Title}>
              Say goodbye to endless searches for notes!
            </h1>
            <p className={styles.Description}>
              Our platform brings together handwritten notes of toppers in one
              easily searchable place, allowing you to spend more time mastering
              your content.
            </p>
          </div>
          <div className={styles.CarouselCard}>
            <h1 className={styles.Title}>Comprehensive and reliable sources</h1>
            <p className={styles.Description}>
              Don't waste time and energy scouring the internet for scattered
              notes. We curate and structure the content from verified channels,
              so you can have access to the best material out there.
            </p>
          </div>
          <div className={styles.CarouselCard}>
            <h1 className={styles.Title}>
              Print what you need, when you need it
            </h1>
            <p className={styles.Description}>
              No need to print stacks of notes anymore. Choose only the
              materials that matter to you, saving money and decluttering your
              study space.
            </p>
          </div>
          <div className={styles.CarouselCard}>
            <h1 className={styles.Title}>Learn from the Toppers</h1>
            <p className={styles.Description}>
              Discover the note-taking techniques and strategies used by
              Toppers. Work smarter by incorporating the practices of successful
              UPSC candidates.
            </p>
          </div>
          <div className={styles.CarouselCard}>
            <h1 className={styles.Title}>Master answer writing skills</h1>
            <p className={styles.Description}>
              Access thousands of previous year questions and answer sheets from
              toppers, empowering you to hone your answer writing abilities and
              excel in the exam.
            </p>
          </div>
        </Carousel>
      </div>
      <div className={styles.InnerContainer}>
        <div className={styles.LoginContainer}>
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
          <div className={styles.TnC}>
            <a href="/pdf/Terms and Conditions.pdf" target="_blank">
              Terms & Conditions
            </a>
            <div>•</div>
            <a href="/pdf/Privacy Policy.pdf" target="_blank">
              Privacy Policy
            </a>
          </div>
          <div className={styles.Rights}>
            <div>© All Rights Reserved; UPSC SmartNotes LLP</div>
          </div>
        </div>
      </div>
    </div>
  );
};
