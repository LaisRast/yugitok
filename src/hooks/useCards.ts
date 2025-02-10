import { useState, useCallback } from "react";
import {ApiResponse, Card} from "../types/Card.ts";
import {useLocalization} from "./useLocalization.ts";

const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = reject;
  });
};

export function useCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [buffer, setBuffer] = useState<Card[]>([]);
  const {currentLanguage} = useLocalization()

  const fetchCards = async (forBuffer = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(currentLanguage.api);

      const data: ApiResponse = await response.json();
      const newCards =data.data

      await Promise.allSettled(newCards.map((card)=>preloadImage(card.card_images[0].image_url)));

      if (forBuffer) {
        setBuffer(newCards);
      } else {
        setCards((prev) => [...prev, ...newCards]);
        fetchCards(true);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
    setLoading(false);
  };

  const getMoreCards = useCallback(() => {
    if (buffer.length > 0) {
      setCards((prev) => [...prev, ...buffer]);
      setBuffer([]);
      fetchCards(true);
    } else {
      fetchCards(false);
    }
  }, [buffer]);

  return { cards, loading, fetchCards: getMoreCards };
}
