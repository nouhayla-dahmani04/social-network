"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { User } from "@/context/AuthContext";

function getAvatarUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
    return `${apiBase}${url.startsWith("/") ? "" : "/"}${url}`;
}

export default function UserSearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Recherche avec Debounce (300ms)
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        const timeoutId = setTimeout(async () => {
            try {
                const users = await apiFetch<User[]>(`/api/users/search?query=${encodeURIComponent(query.trim())}`);
                setResults(users);
                setIsOpen(true);
            } catch (err) {
                console.error("Search error:", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query]);

    // Fermeture lors d'un clic en dehors
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-md mx-auto">
            {/* Champ de saisie */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setIsOpen(true)}
                    placeholder="Rechercher un utilisateur (nom, pseudo)..."
                    className="w-full pl-10 pr-10 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 transition"
                />
                <span className="absolute left-3.5 top-2.5 text-zinc-400 text-sm">🔍</span>
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setResults([]);
                            setIsOpen(false);
                        }}
                        className="absolute right-3.5 top-2.5 text-zinc-400 hover:text-zinc-600 text-xs font-bold"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Menu déroulant des résultats */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg max-h-72 overflow-y-auto z-50 divide-y divide-zinc-100 dark:divide-zinc-800">
                    {loading ? (
                        <div className="p-4 text-center text-xs text-zinc-500">Recherche en cours...</div>
                    ) : results.length === 0 ? (
                        <div className="p-4 text-center text-xs text-zinc-400">Aucun utilisateur trouvé pour "{query}"</div>
                    ) : (
                        results.map((u) => {
                            const avatar = getAvatarUrl(u.avatarUrl);
                            return (
                                <Link
                                    key={u.id}
                                    href={`/profile/${u.id}`}
                                    onClick={() => {
                                        setIsOpen(false);
                                        setQuery("");
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs overflow-hidden flex-shrink-0">
                                        {avatar ? (
                                            <img src={avatar} alt={u.firstName} className="w-full h-full object-cover" />
                                        ) : (
                                            `${u.firstName[0]}${u.lastName[0]}`
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                                            {u.firstName} {u.lastName}
                                        </p>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {u.nickname ? `@${u.nickname}` : u.email}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}

