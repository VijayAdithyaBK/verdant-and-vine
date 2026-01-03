export type AvailabilityStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'seasonal';

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  category: 'indoor' | 'outdoor' | 'succulent' | 'flowering';
  difficulty: 'easy' | 'moderate' | 'expert';
  sunlight: 'low' | 'medium' | 'high';
  water: 'low' | 'medium' | 'high';
  imageUrl: string;
  tags: string[];
  availability: AvailabilityStatus;
  size: string;
  location: string;
  isNew?: boolean;
}

export type FilterState = {
  category: string;
  difficulty: string;
  sunlight: string;
  availability: string;
};

export interface PlantProgress {
  level: number;
  xp: number;
  lastWatered: number;
}

export type TerrariumState = Record<string, PlantProgress>;