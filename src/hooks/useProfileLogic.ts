import React, { useState } from 'react';
import { UserProfile } from '../types';

export const useProfileLogic = (profile: UserProfile, onSave: (profile: UserProfile) => void) => {
  const [activeTab, setActiveTab] = useState<'zaklad' | 'osobni' | 'verejne'>('zaklad');
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'zaklad', label: 'Core' },
    { id: 'osobni', label: 'Personal' },
    { id: 'verejne', label: 'Social' },
  ];

  return {
    activeTab, setActiveTab,
    formData, setFormData,
    showSuccess, setShowSuccess,
    isEditing, setIsEditing,
    handleSubmit,
    tabs
  };
};
