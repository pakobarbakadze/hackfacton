import { Story, Stories } from "../../types/Story.types";

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
};

type StoryProps = {
  story: Story;
};

export type { StoriesListProps, SearchFormProps, StoryProps, SearchSortersProps };
