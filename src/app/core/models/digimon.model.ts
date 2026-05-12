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
