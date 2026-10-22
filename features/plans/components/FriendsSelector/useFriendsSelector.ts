"use client";

import { useState, useEffect } from "react";
import { Friend, FriendFilterCircle } from "../../types";
import { fetchFriendsFromSupabase, fetchFiltersCatalogFromSupabase } from "../../services/plansDb";

import { isSupabaseConfigured } from "@/lib/supabase/client";

interface UseFriendsSelectorProps {
  selectedFriends: Friend[];
}

export function useFriendsSelector({ selectedFriends }: UseFriendsSelectorProps) {
  const [filterCircle, setFilterCircle] = useState<FriendFilterCircle>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [circles, setCircles] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadDbFriendsAndFilters() {
      try {
        const [dbFriends, dbFilters] = await Promise.all([
          fetchFriendsFromSupabase(),
          fetchFiltersCatalogFromSupabase(),
        ]);
        if (isMounted) {
          setFriendsList(dbFriends);
          // Los círculos provienen 100% de la tabla catalogo_filtros en Supabase
          if (dbFilters.circulo.length > 0) {
            setCircles(
              dbFilters.circulo.map((c) => ({
                id: c.clave,
                label: c.etiqueta,
              }))
            );
          }
        }
      } catch (err) {
        console.warn("Error cargando amigos desde Supabase:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadDbFriendsAndFilters();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = friendsList.filter((friend) => {
    const matchesCircle = filterCircle === "todos" || friend.circle === filterCircle;
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCircle && matchesSearch;
  });

  const isSelected = (friendId: string) =>
    selectedFriends.some((f) => f.id === friendId);

  return {
    filterCircle,
    setFilterCircle,
    searchQuery,
    setSearchQuery,
    filtered,
    isSelected,
    isLoading,
    circles,
  };
}
