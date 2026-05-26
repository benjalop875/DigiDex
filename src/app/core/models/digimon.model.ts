export interface Digimon {
  id: number;
  name: string;
  href: string;
  image: string;
}

export interface Pageable {
  currentPage: number;
  elementsOnPage: number;
  totalElements: number;
  totalPages: number;
  previousPage: string;
  nextPage: string;
}

export interface DigimonResponse {
  content: Digimon[];
  pageable: Pageable;
}

export interface DigimonQueryParams {
  name?: string;
  exact?: boolean;
  attribute?: string;
  xAntibody?: boolean;
  level?: string;
  page?: number;
  pageSize?: number;
}

export interface DigimonDetail {
  id: number;
  name: string;
  xAntibody: boolean;
  images: { href: string; transparent: boolean }[];
  levels: { id: number; level: string }[];
  types: { id: number; type: string }[];
  attributes: { id: number; attribute: string }[];
  fields: { id: number; field: string; image: string }[];
  releaseDate: string;
  descriptions: { origin: string; language: string; description: string }[];
  skills: { id: number; skill: string; translation: string; description: string }[];
  priorEvolutions: { id: number; digimon: string; condition: string; image: string; url: string }[];
  nextEvolutions: { id: number; digimon: string; condition: string; image: string; url: string }[];
}

export interface DigiApiField {
  id: number;
  name: string;
  href: string;
}

export interface DigiApiListResponse {
  content: {
    name: string;
    description: string;
    fields: DigiApiField[];
  };
  pageable: Pageable;
}

export interface DigiApiDetailResponse {
  id: number;
  name: string;
  description: string;
}

export interface SkillDetail {
  id: number;
  name: string;
  description: string;
}

export interface SkillListResponse {
  content: {
    name: string;
    description: string;
    fields: DigiApiField[];
  };
  pageable: Pageable;
}

export interface TypeListResponse {
  content: {
    name: string;
    description: string;
    fields: DigiApiField[];
  };
  pageable: Pageable;
}
