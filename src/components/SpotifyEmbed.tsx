import { Music } from "lucide-react";

interface SpotifyEmbedProps {
  playlistId: string;
  mood: string;
}

export function SpotifyEmbed({ playlistId, mood }: SpotifyEmbedProps) {
  if (!playlistId) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Music for your vibe</h3>
          <p className="text-xs text-slate-500">
            Because you&apos;re feeling <strong>{mood}</strong> today. Note: Full playback requires a Spotify login.
          </p>
        </div>
      </div>
      
      <div className="rounded-xl overflow-hidden shadow-inner bg-slate-100 dark:bg-slate-950">
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="border-0"
        />
      </div>
    </div>
  );
}
