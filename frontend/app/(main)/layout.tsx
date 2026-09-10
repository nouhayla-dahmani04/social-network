"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import RightPanel from "@/components/RightPanel";
import Avatar from "@/components/Avatar";

const MOBILE_NAV = [
    { href: "/", label: "Accueil", icon: "🏠" },
    { href: "/groups", label: "Groupes", icon: "👥" },
    { href: "/messages", label: "Messages", icon: "💬" },
    { href: "/notifications", label: "Alertes", icon: "🔔" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <p className="text-sm text-slate-500">Chargement de la session...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                            ✦
                        </span>
                        <span className="font-bold text-slate-900">SocialNet</span>
                    </Link>
                    <Link href="/profile/me">
                        <Avatar firstName={user.firstName} lastName={user.lastName} src={user.avatarUrl} size={36} online />
                    </Link>
                </div>
                <nav className="flex items-center gap-1 overflow-x-auto px-2 pb-2">
                    {MOBILE_NAV.map((item) => {
                        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                                    active ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
                <Sidebar />
                <main className="min-w-0 flex-1">{children}</main>
                <RightPanel />
            </div>
        </div>
    );
}
