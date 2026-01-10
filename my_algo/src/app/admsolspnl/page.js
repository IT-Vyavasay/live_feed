'use client';
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { useRef, useState } from "react"
import Link from "next/link"
import toast from 'react-hot-toast';
import { chk_otp, validate_string, chk_email, chk_password } from "../../utils/common";
import { fetchApi } from "../../utils/frondend";
import Loader from "../../components/include/Loader";
import { useAuthContext } from "../../context/auth";
import ReCAPTCHA from "react-google-recaptcha";

export default function LoginPage() {

  const { setAuthTkn } = useAuthContext();
  const router = useRouter()
  const callbackUrl = "/admsolspnl/dashboard"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [submitLoader, setSubmitLoader] = useState(false)
  const [passwordType, setPasswordType] = useState("password")
  const [isTwoOpen, setIstwoOpen] = useState(false)
  const reRef = useRef()

  const login = async () => {
    try {
      toast.dismiss()
      if (!submitLoader) {
        try {
          validate_string(email, "Email")
          chk_email(email)
          validate_string(password, "Password")
          chk_password(password)
        } catch (e) {
          toast.error(e)
          return false
        }
        setSubmitLoader(true)
        const repchaToken = await reRef.current.executeAsync();
        const param = JSON.stringify({ email: email, password: password, repchaToken: repchaToken })
        const response = await fetchApi("auth/login", param, "POST")
        setSubmitLoader(false)
        if (response.statusCode === 200) {
          if (response.data.data.twoOpen == 1) {
            setIstwoOpen(true)
          }
        } else {
          if (response.data.message == "Unauthorized") {
            setAuthTkn(response.data.message)
          } else {
            toast.error(response.data.message)
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const finalLogin = async () => {
    try {
      if (!submitLoader) {
        // try {
        //   chk_otp(otp)
        // } catch (e) {
        //   toast.error(e)
        //   return false
        // }
        setSubmitLoader(true)
        const repchaToken = await reRef.current.executeAsync();
        const res = await signIn("credentials", {
          redirect: false,
          email: email,
          password: password,
          otp: otp,
          repchaToken: repchaToken,
          callbackUrl,
        })
        setSubmitLoader(false)
        if (res.error == "CredentialsSignin") {
          toast.error("Google authentication failed.")
        } else {
          router.push(process.env.ADMFLDR + '/dashboard')
          window.location.reload()
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="authentication-bg">
        <div className="account-pages">
          <div className="container">
            <div className="row justify-content-center">
              <div className={`${isTwoOpen ? "factor" : ""} col-md-8 col-lg-6 col-xl-5`}>
                <div className="text-center">
                  <Link href={process.env.ADMFLDR || "admsolspnl"} className="logo mb-3">
                    <img src="assets/images/logo/logo.svg" alt="" height="22" className="logo-light mx-auto login-logo" />
                    <img src="assets/images/logo/logo.svg" alt="" height="22" className="logo-dark mx-auto login-logo" />
                  </Link>
                </div>
                <div className="card">
                  <div className="card-body p-4">
                    <div className="text-center mb-4">
                      <h4 className="text-uppercase mt-0">Sign In</h4>
                    </div>
                    {
                      !isTwoOpen ? <>
                        <div className="form-group">
                          <label className="mb-1"><strong>Email</strong></label>
                          <input placeholder="Enter email" type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} onKeyUp={(e) => e.keyCode == 13 && login()} />
                        </div>
                        <label className="mb-1"><strong>Password</strong></label>
                        <div className="form-group">
                          <div className="input-group">
                            <input placeholder="Enter password" type={passwordType} className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} onKeyUp={(e) => e.keyCode == 13 && login()} />
                            <div className="input-group-append">
                              <span className="input-group-text"><i className={`fa fa-eye${passwordType === "password" ? "-slash" : ""}`} onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}></i></span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <button type="button" className="btn btn-bordered-primary waves-effect login-btn waves-light" onClick={() => finalLogin()}>{submitLoader ? <Loader /> : ""}Sign In</button>
                        </div>
                      </> : <>
                        <div className="form-group">
                          <label className="mb-1"><strong>Google authenticator OTP</strong></label>
                          <input placeholder="Enter google authenticator OTP" type="text" className="form-control" value={otp} onChange={(e) => { setOtp(e.target.value = e.target.value.replace(/[^0-9]/g, "").replace(/(\..*)\./g, "$1")) }} onKeyUp={(e) => e.keyCode == 13 && finalLogin()} maxLength={6} />
                        </div>
                        <div className="text-center">
                          <button type="button" className="btn btn-bordered-primary waves-effect login-btn waves-light" onClick={() => finalLogin()}>{submitLoader ? <Loader /> : ""}Verify OTP</button>
                        </div>
                      </>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReCAPTCHA
        sitekey={process.env.SITE_KEY}
        size="invisible"
        ref={reRef}
        style={{ display: "none" }}
      />
    </>
  )
}
