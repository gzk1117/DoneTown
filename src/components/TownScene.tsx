import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { getNestImageForLevel } from "./townAssets";

export type TownWeather = "sunny" | "cloudy" | "rainy";

interface TownSceneProps {
  petLevel: number;
  homeLevel: number;
  weather: TownWeather;
}

interface ScenePoint {
  x: number;
  y: number;
}

interface HeartBurst {
  id: number;
  x: number;
}

const WEATHER_BACKGROUNDS: Record<TownWeather, string> = {
  sunny: "/assets/town/backgrounds/forest-sunny.png",
  cloudy: "/assets/town/backgrounds/forest-cloudy.png",
  rainy: "/assets/town/backgrounds/forest-rainy.png",
};

const PET_STAGES = [
  {
    maxLevel: 1,
    front: "/assets/town/pet-cutout/01_stage1_egg_front.png",
    side: "/assets/town/pet-cutout/02_stage1_egg_side.png",
    label: "\u5b89\u9759\u7684\u86cb",
  },
  {
    maxLevel: 2,
    front: "/assets/town/pet-cutout/03_stage2_hatching_front.png",
    side: "/assets/town/pet-cutout/04_stage2_hatching_side.png",
    label: "\u521a\u5b75\u5316\u7684\u5c0f\u9e21",
  },
  {
    maxLevel: 3,
    front: "/assets/town/pet-cutout/05_stage3_young_chick_front.png",
    side: "/assets/town/pet-cutout/06_stage3_young_chick_side.png",
    label: "\u5e74\u5e7c\u5c0f\u9e21",
  },
  {
    maxLevel: 4,
    front: "/assets/town/pet-cutout/07_stage4_growing_chick_front.png",
    side: "/assets/town/pet-cutout/08_stage4_growing_chick_side.png",
    label: "\u6210\u957f\u4e2d\u7684\u5c0f\u9e21",
  },
  {
    maxLevel: 5,
    front: "/assets/town/pet-cutout/09_stage5_juvenile_chicken_front.png",
    side: "/assets/town/pet-cutout/10_stage5_juvenile_chicken_side.png",
    label: "\u5c11\u5e74\u9e21",
  },
  {
    maxLevel: Number.POSITIVE_INFINITY,
    front: "/assets/town/pet-cutout/11_stage6_adult_chicken_front.png",
    side: "/assets/town/pet-cutout/12_stage6_adult_chicken_side.png",
    label: "\u6210\u5e74\u9e21",
  },
];

const WALK_DURATION_MS = 1650;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getPetStage = (level: number) =>
  PET_STAGES.find((stage) => level <= stage.maxLevel) ?? PET_STAGES[0];

export function TownScene({ petLevel, homeLevel, weather }: TownSceneProps) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const walkTimerRef = useRef<number | null>(null);
  const heartTimerRef = useRef<number | null>(null);
  const heartIdRef = useRef(0);
  const [petPosition, setPetPosition] = useState<ScenePoint>({ x: 52, y: 74 });
  const [petMode, setPetMode] = useState<"front" | "side">("front");
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [heartBursts, setHeartBursts] = useState<HeartBurst[]>([]);
  const petStage = useMemo(() => getPetStage(petLevel), [petLevel]);
  const hasHatched = petLevel >= 2;
  const petImage = petMode === "side" ? petStage.side : petStage.front;
  const nestImage = getNestImageForLevel(homeLevel);

  useEffect(
    () => () => {
      if (walkTimerRef.current) {
        window.clearTimeout(walkTimerRef.current);
      }

      if (heartTimerRef.current) {
        window.clearTimeout(heartTimerRef.current);
      }
    },
    [],
  );

  const resolveScenePoint = (clientX: number, clientY: number): ScenePoint | null => {
    const scene = sceneRef.current;

    if (!scene) {
      return null;
    }

    const rect = scene.getBoundingClientRect();

    return {
      x: clamp(((clientX - rect.left) / rect.width) * 100, 8, 92),
      y: clamp(((clientY - rect.top) / rect.height) * 100, 38, 90),
    };
  };

  const movePetTo = (point: ScenePoint) => {
    if (!hasHatched) {
      return;
    }

    if (walkTimerRef.current) {
      window.clearTimeout(walkTimerRef.current);
    }

    setDirection(point.x < petPosition.x ? "left" : "right");
    setPetMode("side");
    setIsWalking(true);
    setPetPosition(point);

    walkTimerRef.current = window.setTimeout(() => {
      setPetMode("front");
      setIsWalking(false);
    }, WALK_DURATION_MS);
  };

  const handleSceneClick = (event: MouseEvent<HTMLDivElement>) => {
    const nextPoint = resolveScenePoint(event.clientX, event.clientY);

    if (nextPoint) {
      movePetTo(nextPoint);
    }
  };

  const handleSceneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    movePetTo({ x: 52, y: 68 });
  };

  const handlePetClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const nextHeart: HeartBurst = {
      id: heartIdRef.current + 1,
      x: 42 + Math.random() * 22,
    };

    heartIdRef.current = nextHeart.id;
    setHeartBursts((bursts) => [...bursts.slice(-4), nextHeart]);

    if (heartTimerRef.current) {
      window.clearTimeout(heartTimerRef.current);
    }

    heartTimerRef.current = window.setTimeout(() => {
      setHeartBursts([]);
    }, 1000);
  };

  return (
    <div
      aria-label={"\u68ee\u6797\u5c0f\u9547\u573a\u666f"}
      className={[
        "dt-town-scene relative mx-auto min-h-[390px] w-full max-w-4xl cursor-pointer overflow-hidden rounded-[2rem] border-2 border-white/80 bg-cover bg-center shadow-[0_24px_55px_rgba(83,112,78,0.2)] outline-none sm:min-h-[500px]",
        weather === "rainy" ? "dt-town-scene-rainy" : "",
        weather === "cloudy" ? "dt-town-scene-cloudy" : "",
      ].join(" ")}
      onKeyDown={handleSceneKeyDown}
      onClick={handleSceneClick}
      ref={sceneRef}
      role="button"
      style={{ backgroundImage: `url("${WEATHER_BACKGROUNDS[weather]}")` }}
      tabIndex={0}
    >
      {weather === "rainy" && <RainLayer />}

      {nestImage && (
        <img
          aria-hidden="true"
          className="dt-town-nest pointer-events-none absolute left-1/2 top-[62%] z-[4] -translate-x-1/2 -translate-y-1/2 select-none object-contain"
          draggable={false}
          src={nestImage}
        />
      )}

      <button
        aria-label={"\u70b9\u51fb\u5c0f\u9e21"}
        className={[
          "dt-town-pet absolute z-10 flex -translate-x-1/2 -translate-y-full items-end justify-center outline-none transition-[left,top] ease-in-out",
          isWalking ? "dt-town-pet-walking" : "",
        ].join(" ")}
        onClick={handlePetClick}
        style={{
          left: `${petPosition.x}%`,
          top: `${petPosition.y}%`,
          transitionDuration: isWalking ? `${WALK_DURATION_MS}ms` : "260ms",
        }}
        type="button"
      >
        <img
          alt={petStage.label}
          className="dt-town-pet-image select-none object-contain drop-shadow-[0_16px_18px_rgba(83,69,41,0.24)]"
          draggable={false}
          src={petImage}
          style={{
            transform:
              petMode === "side" && direction === "left"
                ? "scaleX(-1)"
                : "scaleX(1)",
          }}
        />
        {heartBursts.map((heart) => (
          <span
            className="dt-heart-pop pointer-events-none absolute text-2xl font-black text-[#ff6d93]"
            key={heart.id}
            style={{ left: `${heart.x}%`, top: "16%" }}
          >
            {"\u2665"}
          </span>
        ))}
      </button>
    </div>
  );
}

function RainLayer() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {Array.from({ length: 24 }, (_, index) => (
        <span
          className="dt-rain-drop absolute top-[-12%] h-16 w-[2px] rounded-full bg-white/55"
          key={index}
          style={{
            animationDelay: `${index * 90}ms`,
            left: `${(index * 41) % 100}%`,
          }}
        />
      ))}
    </div>
  );
}
