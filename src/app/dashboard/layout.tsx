import Image from "next/image";
import { SidebarNav } from "@/components/sidebar-nav";
import { LogoutButton } from "@/components/logout-button";
import { MobileMenuButton } from "@/components/mobile-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MobileMenuButton>
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
      </MobileMenuButton>

      <main className="flex-1 min-w-0 p-4 lg:p-6 pt-16 lg:pt-6">{children}</main>
    </div>
  );
}
