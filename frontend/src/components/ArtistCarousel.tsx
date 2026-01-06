import { X } from 'lucide-react';
import { useArtists } from '../contexts/ArtistContext';

export const ArtistCarousel = ({ onAddClick }: { onAddClick: () => void }) => {
  const { artists, loading, unsubscribe } = useArtists();

  return (
    <div className="flex items-center gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
      <button 
        onClick={onAddClick}
        className="flex-shrink-0 flex flex-col items-center gap-2 group"
      >
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-green-500 group-hover:text-green-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </div>
        <span className="text-[10px] font-bold text-slate-400">Add new</span>
      </button>

      {artists.map((artist) => (
        <div key={artist.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-16 mt-1 relative snap-center">
          <div className="relative">
            <img 
              src={artist.imageUrl ?? `https://ui-avatars.com/api/?name=${artist.name}`} 
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
              alt={artist.name ?? 'Artist'}
            />
            <button
              onClick={() => unsubscribe(artist.id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-white/90 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 rounded-full transition-colors shadow-sm"
              title="Unsubscribe"
            >
              <X size={12} />
            </button>
          </div>
          <span className="text-[10px] font-bold text-slate-600 truncate w-full text-center">
            {artist.name?.split(' ')[0]}
          </span>
        </div>
      ))}
      
      {loading && <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />}
    </div>
  );
};