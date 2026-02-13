import { useState, useRef, useEffect } from "react";
import { GameCard } from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { Music, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Howl } from "howler";

interface Props {
  onComplete: () => void;
}

const SONGS = [
  { id: 1, title: "Shape of You", artist: "Ed Sheeran" },
  {
    id: 2,
    title: "O Mahi",
    artist: "Arijit Singh",
    isCorrect: true,
    preview: "/audio/o_mahi.mpeg",
  },
  { id: 3, title: "Abhi Na Jao", artist: "Rafi Sahab" },
  { id: 4, title: "Ek Din Aap", artist: "Abhijeet" },
];

export default function Level2_Music({ onComplete }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const soundRef = useRef<Howl | null>(null);

  // cleanup
  useEffect(() => {
    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const handleSelect = (song: (typeof SONGS)[0]) => {
    if (selectedId === song.id) return;

    setSelectedId(song.id);

    // ❌ wrong answer
    if (!song.isCorrect) {
      soundRef.current?.stop();
      setIsPlaying(false);
      setMessage(null);
      return;
    }

    // ✅ correct answer
    soundRef.current?.unload();

    soundRef.current = new Howl({
      src: [song.preview!],
      volume: 0.6,
      html5: true,
      onend: () => setIsPlaying(false),
    });

    soundRef.current.play();
    setIsPlaying(true);

    // 💬 emotional text flow (during music)
    setMessage("This song feels like you…");

    setTimeout(() => {
      setMessage("Every word reminds me of us.");
    }, 5000);

    setTimeout(() => {
      setMessage("Some feelings don’t need words. ❤️");
    }, 10000);

    // ⏭️ move ahead after full 15 sec
    setTimeout(() => {
      soundRef.current?.stop();
      onComplete();
    }, 15000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GameCard className="max-w-xl w-full">
        <div className="flex flex-col items-center space-y-8">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
            <Music className="w-8 h-8" />
          </div>

          {/* Heading */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-serif font-medium">
              Which song reminds me of you?
            </h2>
            <p className="text-muted-foreground">
              Listen to your heart…
            </p>
          </div>

          {/* 💖 emotional message */}
          {message && (
            <p className="text-center text-sm md:text-base italic text-muted-foreground animate-in fade-in duration-700">
              {message}
            </p>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-4 w-full">
            {SONGS.map((song) => {
              const isSelected = selectedId === song.id;

              return (
                <Button
                  key={song.id}
                  variant="outline"
                  className={cn(
                    "h-auto py-4 px-6 justify-between text-left rounded-xl border-2 transition-all duration-300",
                    isSelected && song.isCorrect
                      ? "border-primary bg-primary/5 text-primary shadow-md"
                      : isSelected && !song.isCorrect
                      ? "border-destructive bg-destructive/5 text-destructive"
                      : "hover:border-primary/50 hover:bg-accent"
                  )}
                  onClick={() => handleSelect(song)}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-base">
                      {song.title}
                    </span>
                    <span className="text-xs opacity-70 font-medium">
                      {song.artist}
                    </span>
                  </div>

                  {isSelected && song.isCorrect && (
                    <div className="rounded-full bg-primary p-1 text-white animate-in zoom-in">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </GameCard>
    </div>
  );
}
