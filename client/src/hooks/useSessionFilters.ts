import { useSearchParams } from "react-router-dom";
import type { Difficulty, SessionFilters } from "../api/session";
import { useDebouncedValue } from "./useDebouncedValue";

function isDifficulty(value: string): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function parseTagIds(value: string | null) {
  return (value ?? "")
    .split(",")
    .map((tagId) => Number(tagId))
    .filter((tagId) => Number.isInteger(tagId) && tagId > 0);
}

export function useSessionFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const selectedDifficulty = searchParams.get("difficulty") ?? "";
  const selectedTagIds = parseTagIds(searchParams.get("tags"));
  const debouncedSearch = useDebouncedValue(search);
  const difficulty = isDifficulty(selectedDifficulty)
    ? selectedDifficulty
    : undefined;

  const filters: SessionFilters = {
    search: debouncedSearch,
    difficulty,
    tagIds: selectedTagIds,
  };

  const hasActiveFilters =
    search !== "" || selectedDifficulty !== "" || selectedTagIds.length > 0;

  const setSearch = (value: string) => {
    setSearchParams((params) => {
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      return params;
    });
  };

  const setDifficulty = (value: string) => {
    setSearchParams((params) => {
      if (value) {
        params.set("difficulty", value);
      } else {
        params.delete("difficulty");
      }

      return params;
    });
  };

  const setTagIds = (tagIds: number[]) => {
    setSearchParams((params) => {
      if (tagIds.length) {
        params.set("tags", tagIds.join(","));
      } else {
        params.delete("tags");
      }

      return params;
    });
  };

  const addTagId = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      return;
    }

    setTagIds([...selectedTagIds, tagId]);
  };

  const removeTagId = (tagId: number) => {
    setTagIds(selectedTagIds.filter((selectedTagId) => selectedTagId !== tagId));
  };

  return {
    search,
    selectedDifficulty,
    selectedTagIds,
    filters,
    hasActiveFilters,
    setSearch,
    setDifficulty,
    addTagId,
    removeTagId,
  };
}
