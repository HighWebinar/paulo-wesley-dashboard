import Image from "next/image";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <Image
            src="/images/logo-nome.svg"
            alt="Zoryam"
            width={130}
            height={32}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>

        <SidebarNav />

        <div className="p-4 border-t border-gray-200">
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
