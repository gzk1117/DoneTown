import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TaskCategory = "Study" | "Work" | "Health" | "Life";
export type TaskKind = "ShortTimed" | "ShortTarget" | "LongTerm" | "Count";
export type TaskDifficulty = "Easy" | "Medium" | "Hard";
export type TaskStatus = "ToDo" | "Done" | "Abandoned" | "Archived";
export type BuildingMaterial = "wood" | "stone" | "brick";

export interface SubTask {
  id: string;
  title: string;
  weight: number;
  isDone: boolean;
  createdAt: number;
  completedAt?: number;
}

export type RepeatRule =
  | { type: "None" }
  | { type: "Daily" }
  | { type: "Weekly"; weekdays: number[] }
  | { type: "Monthly"; dayOfMonth: number };

export interface Reminder {
  enabled: boolean;
  remindAt?: number;
}

export interface TaskReward {
  coins: number;
  materials: Partial<Record<BuildingMaterial, number>>;
  petExp: number;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  kind: TaskKind;
  difficulty: TaskDifficulty;
  subTasks: SubTask[];
  startAt?: number;
  endAt?: number;
  deadlineAt?: number;
  countGoal?: number;
  countCurrent?: number;
  repeatRule: RepeatRule;
  reminder?: Reminder;
  status: TaskStatus;
  reward: TaskReward;
  carryOverCount: number;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  abandonedAt?: number;
  archivedAt?: number;
}

export interface EchoRecord {
  id: string;
  taskTitle: string;
  category: TaskCategory;
  content: string;
  timestamp: number;
}

export interface Resources {
  coins: number;
  memoryFragments: number;
  materials: Record<BuildingMaterial, number>;
}

export interface PetProgress {
  level: number;
  exp: number;
}

export interface HomeProgress {
  level: number;
}

export interface CreateTaskInput {
  title: string;
  category?: TaskCategory;
  kind?: TaskKind;
  difficulty?: TaskDifficulty;
  subTasks?: Array<string | { title: string; weight: number }>;
  startAt?: number;
  endAt?: number;
  deadlineAt?: number;
  countGoal?: number;
  countCurrent?: number;
  repeatRule?: RepeatRule;
  reminder?: Reminder;
  reward?: Partial<TaskReward>;
}

export interface UpdateTaskInput {
  title?: string;
  category?: TaskCategory;
  kind?: TaskKind;
  difficulty?: TaskDifficulty;
  subTasks?: SubTask[];
  startAt?: number;
  endAt?: number;
  deadlineAt?: number;
  countGoal?: number;
  countCurrent?: number;
  repeatRule?: RepeatRule;
  reminder?: Reminder;
}

export interface CreateRecordInput {
  taskTitle: string;
  category: TaskCategory;
  content: string;
}

export interface CompleteTaskOptions {
  coinMultiplier?: number;
}

export interface DoneTownState {
  tasks: Task[];
  records: EchoRecord[];
  resources: Resources;
  pet: PetProgress;
  home: HomeProgress;

  addTask: (input: CreateTaskInput) => Task;
  updateTask: (taskId: string, input: UpdateTaskInput) => void;
  deleteTask: (taskId: string) => void;
  completeTask: (taskId: string, options?: CompleteTaskOptions) => void;
  abandonTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  reopenTask: (taskId: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  updateCountProgress: (taskId: string, countCurrent: number) => void;

  addRecord: (input: CreateRecordInput) => EchoRecord;
  deleteRecord: (recordId: string) => void;

  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addMemoryFragments: (amount: number) => void;
  spendMemoryFragments: (amount: number) => boolean;
  addMaterials: (materials: Partial<Record<BuildingMaterial, number>>) => void;
  spendMaterials: (materials: Partial<Record<BuildingMaterial, number>>) => boolean;
  buildHome: () => boolean;

  addPetExp: (amount: number) => void;
  resetAll: () => void;
}

const STORAGE_KEY = "donetown-store";

const createInitialResources = (): Resources => ({
  coins: 0,
  memoryFragments: 0,
  materials: {
    wood: 0,
    stone: 0,
    brick: 0,
  },
});

const createInitialPet = (): PetProgress => ({
  level: 1,
  exp: 0,
});

const createInitialHome = (): HomeProgress => ({
  level: 0,
});

const createInitialState = () => ({
  tasks: [] as Task[],
  records: [] as EchoRecord[],
  resources: createInitialResources(),
  pet: createInitialPet(),
  home: createInitialHome(),
});

const expToNextLevel = (level: number) => 100 + (level - 1) * 50;

const difficultyWeights: Record<TaskDifficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const getHomeBuildCost = (homeLevel: number) => ({
  coins: 20 + homeLevel * 10,
  materials: {
    wood: 1 + Math.floor(homeLevel / 2),
    stone: homeLevel >= 1 ? 1 : 0,
    brick: homeLevel >= 3 ? 1 : 0,
  },
});

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const createSubTask = (
  subTask: string | { title: string; weight: number },
): SubTask => ({
  id: createId(),
  title: typeof subTask === "string" ? subTask.trim() : subTask.title.trim(),
  weight:
    typeof subTask === "string"
      ? 1
      : clamp(Number.isFinite(subTask.weight) ? subTask.weight : 1, 0, 100),
  isDone: false,
  createdAt: Date.now(),
});

const getDefaultReward = (difficulty: TaskDifficulty): TaskReward => {
  const weight = difficultyWeights[difficulty];

  return {
    coins: 10 * weight,
    materials: {
      wood: difficulty === "Easy" ? 1 : 0,
      stone: difficulty === "Medium" ? 1 : 0,
      brick: difficulty === "Hard" ? 1 : 0,
    },
    petExp: 15 * weight,
  };
};

const normalizeReward = (
  difficulty: TaskDifficulty,
  reward?: Partial<TaskReward>,
): TaskReward => {
  const defaultReward = getDefaultReward(difficulty);

  return {
    coins: reward?.coins ?? defaultReward.coins,
    materials: {
      ...defaultReward.materials,
      ...reward?.materials,
    },
    petExp: reward?.petExp ?? defaultReward.petExp,
  };
};

const applyPetExp = (pet: PetProgress, amount: number): PetProgress => {
  let level = pet.level;
  let exp = pet.exp + Math.max(0, amount);

  while (exp >= expToNextLevel(level)) {
    exp -= expToNextLevel(level);
    level += 1;
  }

  return { level, exp };
};

const normalizeLegacyStatus = (status: unknown): TaskStatus => {
  if (status === "Done" || status === "done") {
    return "Done";
  }

  if (status === "Abandoned" || status === "abandoned") {
    return "Abandoned";
  }

  if (status === "Archived" || status === "archived") {
    return "Archived";
  }

  return "ToDo";
};

const normalizeLegacyDifficulty = (difficulty: unknown): TaskDifficulty => {
  if (difficulty === "Easy" || difficulty === "low") {
    return "Easy";
  }

  if (difficulty === "Hard" || difficulty === "high") {
    return "Hard";
  }

  return "Medium";
};

const normalizeLegacyCategory = (category: unknown): TaskCategory => {
  if (
    category === "Study" ||
    category === "Work" ||
    category === "Health" ||
    category === "Life"
  ) {
    return category;
  }

  return "Life";
};

const normalizeLegacyKind = (kind: unknown): TaskKind => {
  if (
    kind === "ShortTimed" ||
    kind === "ShortTarget" ||
    kind === "LongTerm" ||
    kind === "Count"
  ) {
    return kind;
  }

  return "ShortTarget";
};

const migrateTask = (rawTask: Partial<Task> & Record<string, unknown>): Task => {
  const now = Date.now();
  const difficulty = normalizeLegacyDifficulty(rawTask.difficulty ?? rawTask.priority);
  const rawSubTasks = Array.isArray(rawTask.subTasks) ? rawTask.subTasks : [];
  const legacySubTaskWeight =
    rawSubTasks.length > 0 ? Math.round(100 / rawSubTasks.length) : 0;
  const subTasks = rawSubTasks.length > 0
    ? rawSubTasks.map((item) => {
        if (typeof item === "string") {
          return createSubTask({ title: item, weight: legacySubTaskWeight });
        }

        const subTask = item as Partial<SubTask>;

        return {
          id: subTask.id ?? createId(),
          title: subTask.title?.trim() ?? "",
          weight: clamp(
            typeof subTask.weight === "number"
              ? subTask.weight
              : legacySubTaskWeight,
            0,
            100,
          ),
          isDone: subTask.isDone ?? false,
          createdAt: subTask.createdAt ?? now,
          completedAt: subTask.completedAt,
        };
      })
    : [];

  return {
    id: rawTask.id ?? createId(),
    title:
      typeof rawTask.title === "string"
        ? rawTask.title.slice(0, 50)
        : "\u672a\u547d\u540d\u4efb\u52a1",
    category: normalizeLegacyCategory(rawTask.category),
    kind: normalizeLegacyKind(rawTask.kind),
    difficulty,
    subTasks,
    startAt: typeof rawTask.startAt === "number" ? rawTask.startAt : undefined,
    endAt: typeof rawTask.endAt === "number" ? rawTask.endAt : undefined,
    deadlineAt:
      typeof rawTask.deadlineAt === "number" ? rawTask.deadlineAt : undefined,
    countGoal:
      typeof rawTask.countGoal === "number" ? Math.max(1, rawTask.countGoal) : undefined,
    countCurrent:
      typeof rawTask.countCurrent === "number"
        ? Math.max(0, rawTask.countCurrent)
        : undefined,
    repeatRule: rawTask.repeatRule ?? { type: "None" },
    reminder: rawTask.reminder,
    status: normalizeLegacyStatus(rawTask.status),
    reward: normalizeReward(difficulty, rawTask.reward),
    carryOverCount: rawTask.carryOverCount ?? 0,
    createdAt: rawTask.createdAt ?? now,
    updatedAt: rawTask.updatedAt ?? now,
    completedAt: rawTask.completedAt,
    abandonedAt: rawTask.abandonedAt,
    archivedAt: rawTask.archivedAt,
  };
};

const migrateRecord = (
  rawRecord: Partial<EchoRecord> & Record<string, unknown>,
): EchoRecord => ({
  id: rawRecord.id ?? createId(),
  taskTitle:
    typeof rawRecord.taskTitle === "string"
      ? rawRecord.taskTitle
      : "\u672a\u547d\u540d\u4efb\u52a1",
  category: normalizeLegacyCategory(rawRecord.category),
  content: typeof rawRecord.content === "string" ? rawRecord.content : "",
  timestamp: typeof rawRecord.timestamp === "number" ? rawRecord.timestamp : Date.now(),
});

export const useDoneTownStore = create<DoneTownState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addTask: (input) => {
        const now = Date.now();
        const difficulty = input.difficulty ?? "Medium";
        const kind = input.kind ?? "ShortTarget";
        const countGoal = Math.max(1, input.countGoal ?? 100);
        const task: Task = {
          id: createId(),
          title: input.title.trim().slice(0, 50),
          category: input.category ?? "Life",
          kind,
          difficulty,
          subTasks:
            input.subTasks
              ?.filter((subTask) =>
                typeof subTask === "string"
                  ? Boolean(subTask.trim())
                  : Boolean(subTask.title.trim()),
              )
              .map(createSubTask) ?? [],
          startAt: kind === "ShortTimed" ? input.startAt : undefined,
          endAt: kind === "ShortTimed" ? input.endAt : undefined,
          deadlineAt: kind === "LongTerm" ? input.deadlineAt : undefined,
          countGoal: kind === "Count" ? countGoal : undefined,
          countCurrent:
            kind === "Count"
              ? clamp(input.countCurrent ?? 0, 0, countGoal)
              : undefined,
          repeatRule: input.repeatRule ?? { type: "None" },
          reminder: input.reminder,
          status: "ToDo",
          reward: normalizeReward(difficulty, input.reward),
          carryOverCount: 0,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          tasks: [task, ...state.tasks],
        }));

        return task;
      },

      updateTask: (taskId, input) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  ...input,
                  title: input.title?.trim().slice(0, 50) ?? task.title,
                  updatedAt: Date.now(),
                }
              : task,
          ),
        }));
      },

      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      completeTask: (taskId, options) => {
        const task = get().tasks.find((item) => item.id === taskId);
        const coinMultiplier = Math.max(1, options?.coinMultiplier ?? 1);

        if (!task || task.status === "Done") {
          return;
        }

        set((state) => ({
          tasks: state.tasks.map((item) =>
            item.id === taskId
              ? {
                  ...item,
                  status: "Done",
                  completedAt: Date.now(),
                  updatedAt: Date.now(),
                }
              : item,
          ),
          resources: {
            ...state.resources,
            coins: state.resources.coins + task.reward.coins * coinMultiplier,
            materials: {
              wood:
                state.resources.materials.wood +
                (task.reward.materials.wood ?? 0),
              stone:
                state.resources.materials.stone +
                (task.reward.materials.stone ?? 0),
              brick:
                state.resources.materials.brick +
                (task.reward.materials.brick ?? 0),
            },
          },
          pet: applyPetExp(state.pet, task.reward.petExp),
        }));
      },

      abandonTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "Abandoned",
                  abandonedAt: Date.now(),
                  updatedAt: Date.now(),
                }
              : task,
          ),
        }));
      },

      archiveTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "Archived",
                  archivedAt: Date.now(),
                  updatedAt: Date.now(),
                }
              : task,
          ),
        }));
      },

      reopenTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  status: "ToDo",
                  completedAt: undefined,
                  abandonedAt: undefined,
                  archivedAt: undefined,
                  updatedAt: Date.now(),
                }
              : task,
          ),
        }));
      },

      toggleSubTask: (taskId, subTaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subTasks: task.subTasks.map((subTask) =>
                    subTask.id === subTaskId
                      ? {
                          ...subTask,
                          isDone: !subTask.isDone,
                          completedAt: subTask.isDone ? undefined : Date.now(),
                        }
                      : subTask,
                  ),
                  updatedAt: Date.now(),
                }
              : task,
          ),
        }));
      },

      updateCountProgress: (taskId, countCurrent) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId || task.kind !== "Count") {
              return task;
            }

            const countGoal = Math.max(1, task.countGoal ?? 1);

            return {
              ...task,
              countCurrent: clamp(countCurrent, 0, countGoal),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      addRecord: (input) => {
        const record: EchoRecord = {
          id: createId(),
          taskTitle: input.taskTitle,
          category: input.category,
          content: input.content.trim(),
          timestamp: Date.now(),
        };

        set((state) => ({
          records: [record, ...state.records],
        }));

        return record;
      },

      deleteRecord: (recordId) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== recordId),
        }));
      },

      addCoins: (amount) => {
        set((state) => ({
          resources: {
            ...state.resources,
            coins: state.resources.coins + Math.max(0, amount),
          },
        }));
      },

      spendCoins: (amount) => {
        const cost = Math.max(0, amount);

        if (get().resources.coins < cost) {
          return false;
        }

        set((state) => ({
          resources: {
            ...state.resources,
            coins: state.resources.coins - cost,
          },
        }));

        return true;
      },

      addMemoryFragments: (amount) => {
        set((state) => ({
          resources: {
            ...state.resources,
            memoryFragments:
              state.resources.memoryFragments + Math.max(0, amount),
          },
        }));
      },

      spendMemoryFragments: (amount) => {
        const cost = Math.max(0, amount);

        if (get().resources.memoryFragments < cost) {
          return false;
        }

        set((state) => ({
          resources: {
            ...state.resources,
            memoryFragments: state.resources.memoryFragments - cost,
          },
        }));

        return true;
      },

      addMaterials: (materials) => {
        set((state) => ({
          resources: {
            ...state.resources,
            materials: {
              wood:
                state.resources.materials.wood + Math.max(0, materials.wood ?? 0),
              stone:
                state.resources.materials.stone +
                Math.max(0, materials.stone ?? 0),
              brick:
                state.resources.materials.brick +
                Math.max(0, materials.brick ?? 0),
            },
          },
        }));
      },

      spendMaterials: (materials) => {
        const cost = {
          wood: Math.max(0, materials.wood ?? 0),
          stone: Math.max(0, materials.stone ?? 0),
          brick: Math.max(0, materials.brick ?? 0),
        };
        const current = get().resources.materials;

        if (
          current.wood < cost.wood ||
          current.stone < cost.stone ||
          current.brick < cost.brick
        ) {
          return false;
        }

        set((state) => ({
          resources: {
            ...state.resources,
            materials: {
              wood: state.resources.materials.wood - cost.wood,
              stone: state.resources.materials.stone - cost.stone,
              brick: state.resources.materials.brick - cost.brick,
            },
          },
        }));

        return true;
      },

      buildHome: () => {
        const state = get();
        const cost = getHomeBuildCost(state.home.level);
        const materials = state.resources.materials;

        if (
          state.resources.coins < cost.coins ||
          materials.wood < cost.materials.wood ||
          materials.stone < cost.materials.stone ||
          materials.brick < cost.materials.brick
        ) {
          return false;
        }

        set((currentState) => ({
          home: {
            level: currentState.home.level + 1,
          },
          resources: {
            ...currentState.resources,
            coins: currentState.resources.coins - cost.coins,
            materials: {
              wood:
                currentState.resources.materials.wood - cost.materials.wood,
              stone:
                currentState.resources.materials.stone - cost.materials.stone,
              brick:
                currentState.resources.materials.brick - cost.materials.brick,
            },
          },
        }));

        return true;
      },

      addPetExp: (amount) => {
        set((state) => ({
          pet: applyPetExp(state.pet, amount),
        }));
      },

      resetAll: () => {
        set(createInitialState());
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 5,
      migrate: (persistedState) => {
        const state = persistedState as Partial<DoneTownState> | undefined;
        const initialState = createInitialState();

        return {
          ...initialState,
          ...state,
          tasks: Array.isArray(state?.tasks)
            ? state.tasks.map((task) =>
                migrateTask(task as Partial<Task> & Record<string, unknown>),
              )
            : initialState.tasks,
          records: Array.isArray(state?.records)
            ? state.records.map((record) =>
                migrateRecord(
                  record as Partial<EchoRecord> & Record<string, unknown>,
                ),
              )
            : initialState.records,
          resources: {
            ...initialState.resources,
            ...state?.resources,
            memoryFragments:
              state?.resources?.memoryFragments ??
              initialState.resources.memoryFragments,
            materials: {
              ...initialState.resources.materials,
              ...state?.resources?.materials,
            },
          },
          pet: {
            ...initialState.pet,
            ...state?.pet,
          },
          home: {
            ...initialState.home,
            ...state?.home,
          },
        };
      },
      partialize: (state) => ({
        tasks: state.tasks,
        records: state.records,
        resources: state.resources,
        pet: state.pet,
        home: state.home,
      }),
    },
  ),
);

export const selectTodoTasks = (state: DoneTownState) =>
  state.tasks.filter((task) => task.status === "ToDo");

export const selectDoneTasks = (state: DoneTownState) =>
  state.tasks.filter((task) => task.status === "Done");

export const selectPetExpToNextLevel = (state: DoneTownState) =>
  expToNextLevel(state.pet.level);

export const getTaskProgress = (task: Task) => {
  if (task.status === "Done") {
    return 100;
  }

  if (task.kind === "Count") {
    const countGoal = Math.max(1, task.countGoal ?? 1);

    return Math.round(clamp(((task.countCurrent ?? 0) / countGoal) * 100, 0, 100));
  }

  if (task.subTasks.length === 0) {
    return 0;
  }

  const completedWeight = task.subTasks.reduce(
    (sum, subTask) => sum + (subTask.isDone ? Math.max(0, subTask.weight) : 0),
    0,
  );

  return Math.round(clamp(completedWeight, 0, 100));
};
