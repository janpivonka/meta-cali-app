import React from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Edit3 } from 'lucide-react';
import { UserProfile } from '../../types';

interface ProfileHeaderProps {
  formData: UserProfile;
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  setFormData: (v: UserProfile) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ formData, isEditing, setIsEditing, setFormData }) => {
  return (
    <div className="flex flex-col items-center space-y-6 pt-4">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative w-32 h-32 rounded-full border-2 border-white/10 overflow-hidden bg-slate-900 flex items-center justify-center">
          <User size={64} className="text-slate-700" />
          <button className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center border-4 border-[#020617] shadow-lg">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">{formData.name}</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="text-[10px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-2 mx-auto hover:text-purple-300 transition-colors"
        >
          <Edit3 size={12} /> Edit Profile
        </button>
      </div>

      <div className="flex justify-center gap-12 sm:gap-16 w-full py-4 border-y border-white/5 text-center">
        <div>
          <p className="text-lg font-black text-white leading-none">{formData.posts}</p>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Posts</p>
        </div>
        <div>
          <p className="text-lg font-black text-white leading-none">{formData.followers}</p>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Followers</p>
        </div>
        <div>
          <p className="text-lg font-black text-white leading-none">{formData.following}</p>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Following</p>
        </div>
      </div>
    </div>
  );
};
