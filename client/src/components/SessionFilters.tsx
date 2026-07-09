import type { SessionTag } from "../api/session";

type SessionFiltersProps = {
  search: string;
  selectedDifficulty: string;
  selectedTags: SessionTag[];
  availableTags: SessionTag[];
  onSearchChange: (value: string) => void;
  onDifficultyChange: (value: string) => void;
  onTagAdd: (tagId: number) => void;
  onTagRemove: (tagId: number) => void;
};

export function SessionFilters(props: SessionFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <input
          className="w-100 py-3.75 px-3 bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg"
          type="text"
          value={props.search}
          onChange={(event) => props.onSearchChange(event.target.value)}
          placeholder="Search sessions..."
        />

        <select
          name="difficulty_select"
          className="bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg py-3.75 px-3"
          value={props.selectedDifficulty}
          onChange={(event) => props.onDifficultyChange(event.target.value)}>
          <option value="">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          name="tag_select"
          className="bg-[#F0F6FF] text-neutral-500 text-sm font-light rounded-lg py-3.75 px-3"
          value=""
          onChange={(event) => {
            const tagId = Number(event.target.value);

            if (Number.isInteger(tagId) && tagId > 0) {
              props.onTagAdd(tagId);
            }
          }}>
          <option value="">Filter by tag</option>
          {props.availableTags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      {props.selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {props.selectedTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => props.onTagRemove(tag.id)}
              className="rounded-full border border-black bg-black px-3 py-1 text-xs font-bold uppercase text-white transition hover:bg-neutral-800"
              aria-label={`Remove ${tag.name} tag filter`}>
              {tag.name} x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
