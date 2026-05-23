import api from "@/api";
import CredentialsProvider from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {},

      async authorize(credentials: any, req) {
        try {
          const { data } = await api.post("/login", {
            email: credentials.email,
            password: credentials.password,
          });

          return {
            id: data.user.id,
            email: data.user.email,
            name: data?.user?.name,
            role: data.user.is_admin,

            token: data.token,
          };
        } catch (err) {
          throw new Error("No user found");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "credentials" && user) {
        token.id = user?.id;
        token.name = user?.name;
        token.email = user?.email;
        token.role = user?.role;
        token.token = user?.token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token?.id;
      session.user.name = token?.name;
      session.user.role = token?.role;
      session.user.email = token?.email;
      session.user.token = token?.token;

      return session;
    },
  },

  jwt: {
    maxAge: 24 * 60 * 60 * 30,
  },

  session: { strategy: "jwt", maxAge: 24 * 60 * 60 * 30 },
  secret: process.env.NEXTAUTH_SECRET,
};
