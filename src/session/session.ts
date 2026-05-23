import { getServerSession } from "next-auth";
import { authConfig } from "../app/api/auth/authOptions";
export default async function getServerCredentials() {
  //@ts-ignore
  return await getServerSession(authConfig);
}
