import CredentialsProvider from "next-auth/providers/credentials";
import { recaptcha, setLoginHistory } from './backend';
import { sql_query } from './dbconnect';
import { dec, encryption_key, passDec } from './common';
export const authOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {},
        password: {},
        otp: {},
        repchaToken: {}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password || !credentials?.otp || !credentials?.repchaToken) {
          return null;
        }
        let checkRepcha = await recaptcha(credentials?.repchaToken);
        if (!checkRepcha) {
          return null
        }
        let user = await sql_query("select password,twoOpen,email,slrAdminId,twoFaCode from tblslr_admin where email = ?", [credentials?.email])
        if (user && credentials.password === passDec(user.password, encryption_key("passwordKey"))) {
          let speakeasy = require("speakeasy")
          let twofa = speakeasy.totp.verify({
            secret: passDec(user.twoFaCode, encryption_key("twofaKey")),
            encoding: "base32",
            token: credentials.otp,
          })
          if (twofa) {

            await setLoginHistory(0, 0)
            return {
              id: user.slrAdminId,
              email: user.email,
            }
          } else {
            return null
          }
        }
        else {
          return null
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        // const u = user as unknown as any;
        return {
          ...token, id: user.id
        };
      }
      return token;
    },
  }
};