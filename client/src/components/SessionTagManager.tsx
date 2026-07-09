import type { FormEvent } from "react";
import type { SessionTag } from "../api/session";
import { Tag } from "./Tag";

type SessionTagManagerProps = {
  sessionTags: SessionTag[];
  availableTags: SessionTag[];
  tagName: string;
  tagError: string | null;
  isCreatingTag: boolean;
  isDeletingTag: boolean;
  deletingTagId: number | null;
  onTagNameChange: (value: string) => void;
  onAttachExistingTag: (tagId: number) => void;
  onCreateTag: (event: FormEvent<HTMLFormElement>) => void;
  onDeleteTag: (tagId: number) => void;
};

export function SessionTagManager(props: SessionTagManagerProps) {
  return (
    <div className="flex flex-col gap-1 py-1">
      <h3 className="font-roboto font-bold text-2xl text-[#223759]">Tags</h3>
      <div className="flex flex-wrap gap-[15px] py-3">
        {props.sessionTags.length > 0 ? (
          props.sessionTags.map((tag) => (
            <Tag
              key={tag.id}
              title={tag.name}
              disabled={props.isDeletingTag && props.deletingTagId === tag.id}
              onDelete={() => props.onDeleteTag(tag.id)}
            />
          ))
        ) : (
          <span className="text-sm font-light text-[#6f6f70]">no tags</span>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-end gap-3 rounded-lg border border-[#e3f2f3] bg-[#f8fbff] p-3">
        <label className="flex flex-col gap-1 text-xs font-medium uppercase text-[#6f6f70]">
          Existing tag
          <select
            disabled={props.isCreatingTag || props.availableTags.length === 0}
            value=""
            onChange={(event) => {
              const tagId = Number(event.target.value);

              if (Number.isInteger(tagId) && tagId > 0) {
                props.onAttachExistingTag(tagId);
              }
            }}
            className="h-9 min-w-48 rounded-md border border-[#e3f2f3] bg-white px-3 text-sm font-light normal-case text-[#223759] outline-none focus:border-[#223759] disabled:opacity-60">
            <option value="">
              {props.availableTags.length > 0
                ? "Choose a tag"
                : "No tags to choose"}
            </option>
            {props.availableTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </label>

        <form onSubmit={props.onCreateTag} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium uppercase text-[#6f6f70]">
            New tag
            <input
              maxLength={20}
              disabled={props.isCreatingTag}
              value={props.tagName}
              onChange={(event) => props.onTagNameChange(event.target.value)}
              placeholder="Tag name"
              className="h-9 w-45 border-b border-[#e3f2f3] bg-transparent text-sm font-light normal-case text-[#223759] outline-none placeholder:text-[#6f6f70]/60 focus:border-[#223759] disabled:opacity-60"
            />
          </label>

          <button
            disabled={props.isCreatingTag || !props.tagName.trim()}
            type="submit"
            className="h-9 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            {props.isCreatingTag ? "Adding..." : "Create tag"}
          </button>
        </form>
      </div>

      {props.tagError && (
        <p className="mt-2 text-sm font-medium text-[#9B4A4A]">
          {props.tagError}
        </p>
      )}
    </div>
  );
}
