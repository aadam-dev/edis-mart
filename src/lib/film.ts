export type FilmChapter = {
  id: string;
  label: string;
  title: string;
  note: string;
  dir: string;
  frames: number;
  /** Prefer contain for pack shots so labels stay readable */
  fit?: "cover" | "contain";
  /** Optional per-frame captions (packs chapter) */
  frameLabels?: string[];
};

/**
 * Signature scroll film — LOCKED contract in docs/10-scroll-film.md.
 * Tree → fruit → process → labeled packs (all four fruits) → crisp.
 * Atmospheric chapters use cover; packs use contain on a toned stage.
 */
export const ritualFilm: FilmChapter[] = [
  {
    id: "tree",
    label: "Tree",
    title: "It starts on the tree.",
    note: "Coconut palms and tropical fruit under Ghana light — the canopy before the snack.",
    dir: "/film/ritual/01-tree",
    frames: 6,
    fit: "cover",
  },
  {
    id: "fruit",
    label: "Fruit",
    title: "Then the fruit, still wet.",
    note: "Coconut, mango, pineapple — opened while the flesh is still sweet, selected for drying.",
    dir: "/film/ritual/02-fruit",
    frames: 6,
    fit: "cover",
  },
  {
    id: "process",
    label: "Process",
    title: "Sliced, steamed, dried clean.",
    note: "Trays in Accra. No preservatives — flakes and chips take shape together.",
    dir: "/film/ritual/03-process",
    frames: 6,
    fit: "cover",
  },
  {
    id: "packs",
    label: "Packs",
    title: "Four snacks. Clear labels.",
    note: "Sweetened coconut, chia coco, mango chips, pineapple chips — real packs, Accra dried.",
    dir: "/film/ritual/04-packs",
    frames: 6,
    fit: "contain",
    frameLabels: [
      "Sweetened coconut flakes",
      "Chia coco",
      "Mango chips",
      "Pineapple chips",
      "Sweetened coconut flakes",
      "Pineapple chips",
    ],
  },
  {
    id: "crisp",
    label: "Crisp",
    title: "Then the crunch.",
    note: "Irregular flakes and chips. Toasted edges. Fruit you can hear.",
    dir: "/film/ritual/05-crisp",
    frames: 6,
    fit: "cover",
  },
];

/** @deprecated use ritualFilm */
export const ghanaFilm = ritualFilm;
/** @deprecated use ritualFilm */
export const coconutFilm = ritualFilm;

export function framePath(chapter: FilmChapter, index: number) {
  const i = Math.max(0, Math.min(chapter.frames - 1, index));
  return `${chapter.dir}/frame_${String(i).padStart(2, "0")}.webp`;
}

export function posterPath(chapter: FilmChapter) {
  return `${chapter.dir}/poster.webp`;
}
