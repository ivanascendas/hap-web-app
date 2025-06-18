export interface PaggingBaseDto {
  $filter?: string;
  $count?: boolean;
  $orderby?: string;
  $skip?: number;
  $top?: number;
}

export interface PaggingResponse<T> {
  items: T[];
  nextPageLink: string | null;
  count: number;
}
