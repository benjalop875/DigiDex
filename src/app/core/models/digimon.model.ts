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
