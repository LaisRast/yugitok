import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {Card} from "../types/Card.ts";

interface LikedCardsContextType {
    likedCards: Card[];
    toggleLike: (card: Card) => void;
    isLiked: (id: number) => boolean;
}

const LikedCardsContext = createContext<LikedCardsContextType | undefined>(undefined);

export function LikedCardsProvider({ children }: { children: ReactNode }) {
    const [likedCards, setLikedCards] = useState<Card[]>(() => {
        const saved = localStorage.getItem("likedCards");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("likedCards", JSON.stringify(likedCards));
    }, [likedCards]);

    const toggleLike = (card: Card) => {
        setLikedCards((prev) => {
            const alreadyLiked = prev.some((a) => a.id === card.id);
            if (alreadyLiked) {
                return prev.filter((a) => a.id !== card.id);
            } else {
                return [...prev, card];
            }
        });
    };

    const isLiked = (id: number) => {
        return likedCards.some((card) => card.id === id);
    };

    return (
      <LikedCardsContext.Provider value={{ likedCards: likedCards, toggleLike, isLiked }}>
          {children}
      </LikedCardsContext.Provider>
    );
}

export function useLikedCards() {
    const context = useContext(LikedCardsContext);
    if (!context) {
        throw new Error("useLikedCards must be used within a LikedCardsProvider");
    }
    return context;
}