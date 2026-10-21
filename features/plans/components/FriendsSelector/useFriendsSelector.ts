"use client";

import { useState } from "react";
import { Friend } from "../../types";
import { MOCK_FRIENDS_TREE } from "../../mockData";

interface UseFriendsSelectorProps {
  selectedFriends: Friend[];
}

export function useFriendsSelector({ selectedFriends }: UseFriendsSelectorProps) {
  const [filterCircle, setFilterCircle] = useState<"todos" | "intimo" | "cercano" | "comunidad">("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_FRIENDS_TREE.filter((friend) => {
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
  };
}
