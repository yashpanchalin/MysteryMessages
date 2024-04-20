"use client";

import {
  UseSessionOptions,
  signIn,
  signOut,
  useSession,
} from "next-auth/react";
export default function SignIn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not Signed in <br />
      <button className="bg-orange-500 px-3 py-1 m-4" onClick={() => signIn()}>
        Signed In
      </button>
    </>
  );
}
