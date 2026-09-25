import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProsAuthForm from "@/components/pros-auth-form";

export const metadata: Metadata = {
  title: "Contractor Sign In",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <>
      <SiteHeader />
      <main className="pro-auth-page">
        <section className="pro-auth-copy">
          <p className="field-label">CONTRACTOR ACCOUNT</p>
          <h1>Sign in to your Arkansas Land Pros account.</h1>
          <p>No password to remember. Enter the email tied to your contractor profile and we’ll send a secure sign-in link.</p>
          <p className="pro-auth-note">Not listed yet? <Link href="/pros/join">Create a free profile.</Link></p>
        </section>
        <aside><ProsAuthForm mode="signin" /></aside>
      </main>
      <SiteFooter />
    </>
  );
}
