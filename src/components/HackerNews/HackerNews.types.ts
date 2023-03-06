import { Story, Stories } from "../../types/Story.types";

type Sort = {
  sortKey: string;
  isReverse: boolean;
};

type StoriesListProps = {
  storiesList: Stories;
};

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type SearchSortersProps = {
  onSortSelect: (event: React.MouseEvent<HTMLElement>, key: string) => void;
  sort: Sort;
};

type StoryProps = {
  story: Story;
};

type PaginationProps = {
  pagination: {
    currPage: number;
    pages: number;
  };
  onPageSelect: (page: number) => void;
};

export type { StoriesListProps, SearchFormProps, StoryProps, SearchSortersProps, PaginationProps };
