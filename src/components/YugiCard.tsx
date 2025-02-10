import {Share2, Heart, EyeClosed, Eye} from 'lucide-react';
import {useState} from 'react';
import {Card} from "../types/Card.ts";
import {useLikedCards} from "../contexts/LikedCardsContext.tsx";
import {useLocalization} from "../hooks/useLocalization.ts";


interface YugiCardProps {
    card: Card;
    showCardInfo: boolean;
    setShowCardInfo: (showCardInfo: boolean) => void;
}

export function YugiCard({card, showCardInfo, setShowCardInfo}: YugiCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const {toggleLike, isLiked} = useLikedCards();
    const {currentLanguage} = useLocalization();

    const handleShare = async () => {

        if (navigator.share) {
            try {
                await navigator.share({
                    title: card.name,
                    text: card.desc,
                    url: card.ygoprodeck_url
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(card.ygoprodeck_url);
            alert('Link copied to clipboard!');
        }
    };

    return (
      <div className="h-screen w-full flex items-center justify-center snap-start relative">
          <div className="h-full w-full relative">
              {card.card_images[0].image_url ? (
                <div className="absolute inset-0">
                    <img
                      loading="lazy"
                      src={card.card_images[0].image_url}
                      alt={card.name}
                      className={`h-auto w-auto transition-opacity duration-300 bg-white ${imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                          margin: "auto",
                          position: 'absolute',
                          top: '40%',
                          left: '50%',
                          transform: 'translate(-50%, -40%)',
                          maxHeight: '100%',
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                          console.error('Image failed to load:', e);
                          setImageLoaded(true); // Show content even if image fails
                      }}
                    />
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-900 animate-pulse"/>
                    )}
                    {showCardInfo && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80"/>
                    )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-gray-900"/>
              )}
              {/* Content container with z-index to ensure it's above the image */}
              <div className="absolute bottom-[5vh] left-0 right-0 p-6 text-white z-10"
                   style={{direction: currentLanguage.id === "ar" ? "rtl" : "ltr"}}>
                  <div className="flex justify-between items-start mb-3 ">
                      <a
                        href={card.ygoprodeck_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-200 transition-colors"
                      >
                          <h2 className={`text-2xl font-bold drop-shadow-lg ${showCardInfo ? "" : "invisible"}`}>{card.name}</h2>
                      </a>
                  </div>
                  <p
                    className={`text-gray-100 mb-4 drop-shadow-lg line-clamp-6 ${showCardInfo ? "" : "invisible"}`}>{card.desc}</p>
                  <div className="flex justify-end items-start mb-3 ">
                      <div className="flex gap-2">
                          <button
                            onClick={() => toggleLike(card)}
                            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isLiked(card.id)
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-white/10 hover:bg-white/20'
                            }`}
                            aria-label="Like card"
                          >
                              <Heart
                                className={`w-5 h-5 ${isLiked(card.id) ? 'fill-white' : ''}`}
                              />
                          </button>
                          <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            aria-label="Share card"
                          >
                              <Share2 className="w-5 h-5"/>
                          </button>
                          <button
                            onClick={() => setShowCardInfo(!showCardInfo)}
                            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                            aria-label="Share card"
                          >
                              {showCardInfo ? (<EyeClosed className="w-5 h-5"/>) : (<Eye className="w-5 h-5"/>)}

                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
}
