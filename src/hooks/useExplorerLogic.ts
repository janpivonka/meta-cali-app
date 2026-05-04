import React, { useState, useMemo } from 'react';
import { EXERCISE_LIBRARY } from '../data/exerciseLibrary';
import { ExerciseDefinition, UserProfile } from '../types';

export const useExplorerLogic = (profile: UserProfile, onUpdateProfile: (p: UserProfile) => void) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDefinition | null>(null);

  const categories = ['Pull', 'Push', 'Statics', 'Legs', 'Core', 'Dynamic'];

  const filteredResults = useMemo(() => {
    return EXERCISE_LIBRARY.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentFavorites = Array.isArray(profile.favoriteExercises) ? profile.favoriteExercises : [];
    const isFavorite = currentFavorites.includes(id);
    let newFavorites: string[];
    if (isFavorite) {
      newFavorites = currentFavorites.filter(favId => favId !== id);
    } else {
      newFavorites = [...currentFavorites, id];
    }
    onUpdateProfile({ ...profile, favoriteExercises: newFavorites });
  };

  return {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    selectedCategory, setSelectedCategory,
    selectedExercise, setSelectedExercise,
    categories,
    filteredResults,
    toggleFavorite
  };
};
