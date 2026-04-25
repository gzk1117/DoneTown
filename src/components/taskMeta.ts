import {
  BookOpen,
  BriefcaseBusiness,
  Dumbbell,
  Home,
  type LucideIcon,
} from "lucide-react";
import type { TaskCategory, TaskDifficulty } from "../store/useDoneTownStore";

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
    iconClassName: "text-sky-600",
    badgeClassName: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    value: "Work",
    label: "\u5de5\u4f5c",
    icon: BriefcaseBusiness,
    iconClassName: "text-violet-600",
    badgeClassName: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  {
    value: "Health",
    label: "\u5065\u5eb7",
    icon: Dumbbell,
    iconClassName: "text-emerald-600",
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    value: "Life",
    label: "\u751f\u6d3b",
    icon: Home,
    iconClassName: "text-amber-600",
    badgeClassName: "bg-amber-50 text-amber-800 ring-amber-100",
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
    className: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    value: "Medium",
    label: "\u4e2d\u7b49",
    className: "bg-amber-50 text-amber-800 ring-amber-100",
  },
  {
    value: "Hard",
    label: "\u56f0\u96be",
    className: "bg-rose-50 text-rose-700 ring-rose-100",
  },
];

export const getCategoryMeta = (category: TaskCategory) =>
  categoryOptions.find((option) => option.value === category) ??
  categoryOptions[categoryOptions.length - 1];

export const getDifficultyMeta = (difficulty: TaskDifficulty) =>
  difficultyOptions.find((option) => option.value === difficulty) ??
  difficultyOptions[1];
