interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

export interface Card {
  id: number;
  name: string;
  desc: string;
  ygoprodeck_url: string;
  card_images: CardImage[];
}

export interface ApiResponse {
  data: Card[];
}
