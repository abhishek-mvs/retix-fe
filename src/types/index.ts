export interface Event {
  id: string;
  title: string;
  imageUrl: string;
  likes: string;
  date?: string;
  location?: string;
  description?: string;
  price?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Filter {
  location?: string;
  date?: string;
  category?: string;
}
