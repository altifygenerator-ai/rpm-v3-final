import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import ProsAuthForm from "@/components/pros-auth-form";

export const metadata: Metadata = {
  title: "Join Arkansas Land Pros",
  description: "Create a free contractor profile and start receiving matching Arkansas land-service lead opportunities.",
  robots: { index: true, follow: true },
};

export default function JoinPage() {
  return (
    <>
      <SiteHeader />
      <main className="pro-auth-page">
        <section className="pro-auth-copy">
          <p className="field-label">FREE CONTRACTOR PROFILE</p>
          <h1>Put your business where Arkansas property owners are looking.</h1>
          <p>
            Joining is free. Your public profile can show what you do, where you work, and how customers can find you.
            When a matching lead comes in, you can preview it and decide whether the unlock price makes sense.
          </p>
          <p className="pro-auth-note">Already have an account? <Link href="/pros/sign-in">Sign in here.</Link></p>
        </section>
        <aside><ProsAuthForm mode="join" /></aside>
      </main>
      <SiteFooter />
    </>
  );
}
