import { useEffect, useRef, useCallback, useState } from "react";
import { Loader2, Search, X, Download } from "lucide-react";
import { Analytics } from "@vercel/analytics/react";
import {useCards} from "./hooks/useCards.ts";
import {useLikedCards} from "./contexts/LikedCardsContext.tsx";
import {LanguageSelector} from "./components/LanguageSelector.tsx";
import {YugiCard} from "./components/YugiCard.tsx";

function App() {
  const [showAbout, setShowAbout] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const { cards, loading, fetchCards } = useCards();
  const { likedCards, toggleLike } = useLikedCards();
  const observerTarget = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCardInfo, setShowCardInfo] = useState(true);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && !loading) {
        fetchCards();
      }
    },
    [loading, fetchCards]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchCards();
  }, []);

  const filteredLikedCards = likedCards.filter(
    (card) =>
      card.id.toString().includes(searchQuery.toLowerCase()) ||
      card.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const simplifiedCards = likedCards.map((card) => ({
      id: card.id,
      url: card.ygoprodeck_url,
      desc: card.desc,
      image: card.card_images[0].image_url || null,
    }));

    const dataStr = JSON.stringify(simplifiedCards, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `yugitok-favorites-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => window.location.reload()}
          className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
        >
          YugiTok
        </button>
      </div>

      <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => setShowAbout(!showAbout)}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          About
        </button>
        <button
          onClick={() => setShowLikes(!showLikes)}
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Likes
        </button>
        <LanguageSelector />
      </div>

      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 z-[41] p-6 rounded-lg max-w-xl relative">
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">About YugiTok</h2>
            <p className="mb-4">
              A TikTok-style interface for exploring random Yu-Gi-Oh! cards.
            </p>
            <p className="mb-4 text-white/70 mt-2">
              Check out the code on{" "}
              <a
                href="https://github.com/LaisRast/yugitok"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                GitHub
              </a>.
            </p>
            <p className="mb-4 text-white/70">
              This app is forked from {" "}
              <a
                href="https://www.wikitok.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                WikiTok
              </a>
              {" "}(created by {" "}
              <a
                href="https://x.com/Aizkmusic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                @Aizkmusic
              </a>
              ).
            </p>
            <p className="text-white/70">
              This app uses {" "}
              <a
                href="https://ygoprodeck.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:underline"
              >
                YGOPRODeck
              </a>
              {" "} api.
            </p>
          </div>
          <div
            className={`w-full h-full z-[40] top-1 left-1  bg-[rgb(28 25 23 / 43%)] fixed  ${
              showAbout ? "block" : "hidden"
            }`}
            onClick={() => setShowAbout(false)}
          ></div>
        </div>
      )}

      {showLikes && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 z-[41] p-6 rounded-lg w-full max-w-2xl h-[80vh] flex flex-col relative">
            <button
              onClick={() => setShowLikes(false)}
              className="absolute top-2 right-2 text-white/70 hover:text-white"
            >
              ✕
            </button>

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Liked Cards</h2>
              {likedCards.length > 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  title="Export liked cards"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search liked cards..."
                className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              {filteredLikedCards.length === 0 ? (
                <p className="text-white/70">
                  {searchQuery ? "No matches found." : "No liked cards yet."}
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredLikedCards.map((card) => (
                    <div
                      key={card.id}
                      className="flex gap-4 items-start group"
                    >
                      {card.card_images[0].image_url && (
                        <img
                          src={card.card_images[0].image_url}
                          alt={card.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <a
                            href={card.ygoprodeck_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold hover:text-gray-200"
                          >
                            {card.name}
                          </a>
                          <button
                            onClick={() => toggleLike(card)}
                            className="text-white/50 hover:text-white/90 p-1 rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                            aria-label="Remove from likes"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-2">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div
            className={`w-full h-full z-[40] top-1 left-1  bg-[rgb(28 25 23 / 43%)] fixed  ${
              showLikes ? "block" : "hidden"
            }`}
            onClick={() => setShowLikes(false)}
          ></div>
        </div>
      )}

      {cards.map((card) => (
        <YugiCard key={card.id} card={card} showCardInfo={showCardInfo} setShowCardInfo={setShowCardInfo} />
      ))}
      <div ref={observerTarget} className="h-10 -mt-1" />
      {loading && (
        <div className="h-screen w-full flex items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      )}
      <Analytics />
    </div>
  );
}

export default App;
