import { cookies } from "next/headers";

export const isAuthenticated = async () => {
  const cookieStore = await cookies();
  const isAuthenticated = !!cookieStore.get('kevchat_access_token');

  return isAuthenticated;
};