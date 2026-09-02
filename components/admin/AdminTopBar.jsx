'use client';

import { useState } from 'react';
import { Search, Plus, Bell } from 'lucide-react';

export default function AdminTopBar({ onAddPatient, onSearch }) {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 h-16 px-4 lg:px-6 bg-[#FBF7F5]/95 backdrop-blur border-b border-[#3D1F5C]/10">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D1F5C]/50" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search patients"
          className="w-full pl-9 pr-3 py-2 rounded-full text-sm bg-white border border-[#3D1F5C]/15
                     text-[#3D1F5C] placeholder:text-[#3D1F5C]/40
                     focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
        />
      </div>

      <div className="flex-1" />

      <button
        type="button"
        className="p-2 rounded-full text-[#3D1F5C]/70 hover:bg-[#3D1F5C]/5 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" strokeWidth={1.75} />
      </button>

      <button
        type="button"
        onClick={onAddPatient}
        className="flex items-center gap-2 rounded-full bg-[#F0507B] text-white text-sm font-medium
                   px-4 py-2 hover:bg-[#e13f68] transition-colors shrink-0"
      >
        <Plus className="w-4 h-4" strokeWidth={2} />
        <span className="hidden sm:inline">Add patient</span>
      </button>
    </header>
  );
}