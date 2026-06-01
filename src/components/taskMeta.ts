import {
  BookOpen,
  BriefcaseBusiness,
  CalendarClock,
  Clock3,
  Dumbbell,
  Gauge,
  Home,
  Target,
  type LucideIcon,
} from "lucide-react";
import type {
  TaskCategory,
  TaskDifficulty,
  TaskKind,
} from "../store/useDoneTownStore";

export type CategoryFilterValue = "All" | TaskCategory;

export interface CategoryOption {
  value: TaskCategory;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
  badgeClassName: string;
}

export const categoryOptions: CategoryOption[] = [
  {
    value: "Study",
    label: "\u5b66\u4e60",
    icon: BookOpen,
    iconClassName: "text-[#3c8db7]",
    badgeClassName: "bg-[#e4f6ff] text-[#2d6e91] ring-[#bde9ff]",
  },
  {
    value: "Work",
    label: "\u5de5\u4f5c",
    icon: BriefcaseBusiness,
    iconClassName: "text-[#7b62b8]",
    badgeClassName: "bg-[#f0eaff] text-[#654ba4] ring-[#d9ccff]",
  },
  {
    value: "Health",
    label: "\u5065\u5eb7",
    icon: Dumbbell,
    iconClassName: "text-[#4f9b62]",
    badgeClassName: "bg-[#e8f8df] text-[#3f7a4a] ring-[#c4edb6]",
  },
  {
    value: "Life",
    label: "\u751f\u6d3b",
    icon: Home,
    iconClassName: "text-[#c97832]",
    badgeClassName: "bg-[#fff0cb] text-[#8a5527] ring-[#ffd56b]",
  },
];

export const difficultyOptions: Array<{
  value: TaskDifficulty;
  label: string;
  className: string;
}> = [
  {
    value: "Easy",
    label: "\u7b80\u5355",
    className: "bg-[#e8f8df] text-[#3f7a4a] ring-[#c4edb6]",
  },
  {
    value: "Medium",
    label: "\u4e2d\u7b49",
    className: "bg-[#fff0cb] text-[#8a5527] ring-[#ffd56b]",
  },
  {
    value: "Hard",
    label: "\u56f0\u96be",
    className: "bg-[#ffe7ed] text-[#9d5064] ring-[#ffbed0]",
  },
];

export const taskKindOptions: Array<{
  value: TaskKind;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  className: string;
}> = [
  {
    value: "ShortTimed",
    label: "\u77ed\u671f\u9650\u65f6\u4efb\u52a1",
    shortLabel: "\u9650\u65f6",
    icon: Clock3,
    className: "bg-[#e4f6ff] text-[#2d6e91] ring-[#bde9ff]",
  },
  {
    value: "ShortTarget",
    label: "\u77ed\u671f\u8fbe\u6807\u6027\u4efb\u52a1",
    shortLabel: "\u8fbe\u6807",
    icon: Target,
    className: "bg-[#e8f8df] text-[#3f7a4a] ring-[#c4edb6]",
  },
  {
    value: "LongTerm",
    label: "\u957f\u671f\u4efb\u52a1",
    shortLabel: "\u957f\u671f",
    icon: CalendarClock,
    className: "bg-[#f0eaff] text-[#654ba4] ring-[#d9ccff]",
  },
  {
    value: "Count",
    label: "\u8ba1\u6570\u4efb\u52a1",
    shortLabel: "\u8ba1\u6570",
    icon: Gauge,
    className: "bg-[#fff0cb] text-[#8a5527] ring-[#ffd56b]",
  },
];

export const getCategoryMeta = (category: TaskCategory) =>
  categoryOptions.find((option) => option.value === category) ??
  categoryOptions[categoryOptions.length - 1];

export const getDifficultyMeta = (difficulty: TaskDifficulty) =>
  difficultyOptions.find((option) => option.value === difficulty) ??
  difficultyOptions[1];

export const getTaskKindMeta = (kind: TaskKind) =>
  taskKindOptions.find((option) => option.value === kind) ??
  taskKindOptions[1];
