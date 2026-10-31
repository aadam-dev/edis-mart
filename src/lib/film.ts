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
 * Signature scroll film — tree → fruit → process → labeled packs (all fruits) → crisp.
 * Tree/fruit/crisp use the proven coconut motion plates.
 * Packs use real Yeskoko product photography so labels are readable.
 */
export const ritualFilm: FilmChapter[] = [
  {
    id: "tree",
    label: "Tree",
    title: "It starts on the tree.",
    note: "Ghana canopy. Fruit waiting in the crown — coconut first, tropical fruit beside it.",
    dir: "/film/ritual/01-tree",
    frames: 6,
    fit: "contain",
  },
  {
    id: "fruit",
    label: "Fruit",
    title: "Then the fruit, still wet.",
    note: "Opened while the flesh is still sweet — coconut, mango, pineapple ready for drying.",
    dir: "/film/ritual/02-fruit",
    frames: 6,
    fit: "contain",
  },
  {
    id: "process",
    label: "Process",
    title: "Sliced, steamed, dried clean.",
    note: "Trays in Accra. No preservatives — coconut flakes and fruit chips take shape together.",
    dir: "/film/ritual/03-process",
    frames: 6,
    fit: "cover",
  },
  {
    id: "packs",
    label: "Packs",
    title: "Four snacks. Clear labels.",
    note: "Yeskoko coconut flakes, chia coco, mango chips, pineapple chips — real packs, Accra dried.",
    dir: "/film/ritual/04-packs",
    frames: 6,
    fit: "contain",
    frameLabels: [
      "Sweetened coconut flakes",
      "Unsweetened coconut",
      "Chia coco",
      "Mango chips",
      "Pineapple chips",
      "Sweetened coconut flakes",
    ],
  },
  {
    id: "crisp",
    label: "Crisp",
    title: "Sun, and then the crunch.",
    note: "Irregular flakes and chips. Toasted edges. Fruit you can hear.",
    dir: "/film/ritual/05-crisp",
    frames: 6,
    fit: "contain",
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
