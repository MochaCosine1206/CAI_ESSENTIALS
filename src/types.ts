interface Artwork {
  title: string;
  id: number;
  imageId: string;
}

export interface Artist {
  artist_title: string | null;
  artist_id: string | null | undefined;
  art_list: Artwork[];
}

export type ArtworkItem = {
  _score: number;
  date_display?: string;
  artist_title?: string | null;
  id: number;
  image_id: string;
  title: string;
  artist_id?: string | null;
};

interface SuggestAutocomplete {
  input: string[];
  weight: number;
  contexts: {
    groupings: string[];
  };
}

export type ArtistDetailAgent = {
  id: number;
  api_model: string;
  api_link: string;
  title: string;
  sort_title: string;
  alt_titles: string[];
  is_artist: boolean;
  birth_date: number | null;
  death_date: number | null;
  description: string | null;
  ulan_id: string | null;
  suggest_autocomplete_all: SuggestAutocomplete;
  source_updated_at: string;
  updated_at: string;
  timestamp: string;
};

interface Thumbnail {
  lqip: string;
  width: number;
  height: number;
  alt_text: string;
}

export interface ImageDataType {
  title: string;
  thumbnail: Thumbnail;
  artist_display: string;
  description: string | null;
  short_description: string | null;
  medium_display: string;
  image_id: string;
}
