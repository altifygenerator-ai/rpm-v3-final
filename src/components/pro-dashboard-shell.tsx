import Link from "next/link";
import type { ContractorContext } from "@/lib/contractor-auth";

export default function ProDashboardShell({
  context,
  children,
}: {
  context: ContractorContext;
  children: React.ReactNode;
}) {
  return (
    <div className="pro-dashboard-shell">
      <aside className="pro-sidebar">
        <Link href="/" className="pro-side-brand">ARKANSAS LAND PROS</Link>
        <div className="pro-business-name">{context.profile.business_name}</div>
        <nav>
          <Link href="/pro/dashboard">Dashboard</Link>
          <Link href="/pro/leads">Lead marketplace</Link>
          <Link href="/pro/profile">Public profile</Link>
          <Link href={`/pros/${context.profile.slug}`}>View listing</Link>
          {context.profile.access_role === "house_owner" ? (
            <Link href="/pro/lead-control">Lead control</Link>
          ) : null}
          <Link href="/pro/logout">Sign out</Link>
        </nav>
      </aside>
      <main className="pro-dashboard-main">{children}</main>
    </div>
  );
}
