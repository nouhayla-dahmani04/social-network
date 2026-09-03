"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // 👥 Utilisation du système de votre binôme

interface PostResponse {
  id: string;
  content: string;
  imageUrl: string | null;
  privacy: string;
  createdAt: string;
  likesCount: number; // 📊 Rempli par likeRepository.countByPostId()
  likedByMe: boolean; // 🔴 Rempli par likeRepository.findByPostIdAndUserId().isPresent()
}

export default function ProfilTestPage() {
  const router = useRouter();
  
  // 🔑 Récupération de la session vivante et certifiée par cookie (JSESSIONID)
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth(); 

  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState("");

  // États locaux pour piloter les formulaires du CRUD
  const [newPostContent, setNewPostContent] = useState("");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const baseUrl = "http://localhost:8080/api";

  // 1. [R]UD : Lire et charger les publications depuis Spring Boot
  const loadPosts = () => {
    if (!user?.id) return;

    fetch(`${baseUrl}/users/${user.id}/posts`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Impossible de charger vos publications");
        return res.json();
      })
      .then((data: PostResponse[]) => {
        setPosts(data);
        setPostsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setPostsLoading(false);
      });
  };

  // 🔒 BARRIÈRE DE SÉCURITÉ FRONTEND : Chasse les intrus si pas de cookie valide
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login"); 
    }
  }, [authLoading, isAuthenticated, router]);

  // Déclenche le chargement dès que Spring Security a validé l'identité du user
  useEffect(() => {
    if (isAuthenticated && user) {
      loadPosts();
    }
  }, [isAuthenticated, user]);

  // ==========================================
  // 🛠️ OPÉRATIONS LIAISON API (SPRING BOOT)
  // ==========================================

  // [C]RUD : Créer une publication
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPostContent, privacy: "PUBLIC" }),
        credentials: "include",
      });
      if (response.ok) {
        setNewPostContent("");
        loadPosts(); // Réactualise le flux
      }
    } catch (err) { console.error(err); }
  };

  // CR[U]D : Modifier le contenu d'une publication
  const handleUpdatePost = async (postId: string) => {
    if (!editingContent.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
        credentials: "include",
      });
      if (response.ok) {
        setEditingPostId(null);
        loadPosts();
      }
    } catch (err) { console.error(err); }
  };

  // CRU[D] : Supprimer physiquement de SQLite via le ON DELETE CASCADE
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Supprimer définitivement cette publication ?")) return;

    try {
      const response = await fetch(`${baseUrl}/posts/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) loadPosts();
    } catch (err) { console.error(err); }
  };

  // 💥 INTÉRACTION : L'interrupteur de Likes (Instagram Toggle)
  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${baseUrl}/posts/${postId}/like`, {
        method: "POST",
        credentials: "include", // 🔑 Indispensable pour transmettre de force le JSESSIONID
      });
      if (response.ok) {
        loadPosts(); // Rappelle le service pour recalculer le chiffre et la couleur
      }
    } catch (err) { console.error(err); }
  };

  // Gestion des états de transition visuelle
  if (authLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Vérification de la session Spring Boot...</div>;
  if (!isAuthenticated) return null;
  if (postsLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-sm text-gray-500">Ouverture de votre espace profil...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      
      {/* Barre d'entête avec bouton de déconnexion pour tester à blanc */}
      <div className="flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.firstName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-800">{user?.firstName} {user?.lastName}</h1>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={() => { logout(); router.push("/login"); }}
          className="text-xs font-semibold bg-gray-50 text-red-600 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
        >
          Déconnexion
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100">⚠️ Erreur : {error}</div>
      )}

      {/* Formulaire de publication (Create) */}
      <form onSubmit={handleCreatePost} className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder={`Quoi de neuf, ${user?.firstName} ?`}
          className="w-full text-xs border rounded-lg p-3 outline-none text-gray-800 resize-none h-16 focus:border-blue-500 transition"
        />
        <div className="flex justify-end">
          <button type="submit" className="bg-gray-950 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-800 transition shadow-sm">
            Publier
          </button>
        </div>
      </form>

      {/* Flux vertical des publications (Read, Update, Delete, Like) */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-6 bg-white border rounded-xl shadow-sm">Aucune publication pour le moment.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
              
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{post.privacy}</span>
                <div className="flex gap-3">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => { setEditingPostId(post.id); setEditingContent(post.content); }} className="text-blue-500 hover:underline">Modifier</button>
                  <button onClick={() => handleDeletePost(post.id)} className="text-red-500 hover:underline">Supprimer</button>
                </div>
              </div>

              {editingPostId === post.id ? (
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={editingContent} 
                    onChange={(e) => setEditingContent(e.target.value)} 
                    className="w-full text-xs border rounded p-2 text-gray-800 outline-none focus:border-blue-500" 
                  />
                  <div className="flex gap-2 justify-end text-[10px]">
                    <button onClick={() => setEditingPostId(null)} className="text-gray-400">Annuler</button>
                    <button onClick={() => handleUpdatePost(post.id)} className="bg-green-600 text-white px-2.5 py-1 rounded font-medium">Sauvegarder</button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-800 text-xs leading-relaxed">{post.content}</p>
              )}

              {/* Barre interactive : Like à la Instagram */}
              <div className="pt-2.5 border-t flex items-center gap-3">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                    post.likedByMe 
                      ? "bg-red-50 text-red-500 border-red-200 font-bold" 
                      : "bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50"
                  }`}
                >
                  {post.likedByMe ? "❤️ Aimé" : "🤍 Liker"}
                </button>
                <span className="text-[11px] text-gray-400 font-medium">{post.likesCount} J'aime</span>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
