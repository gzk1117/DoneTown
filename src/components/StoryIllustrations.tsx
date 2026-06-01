import type { ReactNode } from "react";

type ResourceIconType = "coins" | "materials" | "memory";

interface IconProps {
  className?: string;
}

export function ResourceIcon({
  type,
  className = "h-8 w-8",
}: IconProps & { type: ResourceIconType }) {
  if (type === "materials") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 43 39 19c4-4 11 2 7 7L23 50c-4 4-12-2-8-7Z"
          fill="#b77945"
          stroke="#6f4327"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M22 42c6 1 13-5 17-12"
          fill="none"
          stroke="#e9b777"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <path
          d="M16 29h20c5 0 7 8 1 10H17c-6 0-7-10-1-10Z"
          fill="#8fcf7d"
          stroke="#4f8c52"
          strokeWidth="3"
        />
      </svg>
    );
  }

  if (type === "memory") {
    return (
      <svg
        aria-hidden="true"
        className={className}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 24 27 12h11l10 12-16 28L16 24Z"
          fill="#a6d8ff"
          stroke="#4b78b7"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path d="M16 24h32M27 12l5 12 6-12" stroke="#f8fbff" strokeWidth="3" />
        <path d="M32 24v28" stroke="#6aa9e9" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="32"
        cy="32"
        fill="#ffd56b"
        r="22"
        stroke="#b86f2d"
        strokeWidth="3"
      />
      <circle cx="32" cy="32" fill="#ffeb9a" r="14" />
      <path
        d="M32 20v24M24 27c2-4 14-4 16 0M24 37c2 4 14 4 16 0"
        fill="none"
        stroke="#a86525"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

export function PetAvatar({
  level,
  className = "h-32 w-32",
  animated = true,
}: IconProps & { level: number; animated?: boolean }) {
  const stage = level >= 4 ? "bird" : level >= 2 ? "chick" : "egg";

  return (
    <svg
      aria-hidden="true"
      className={[className, animated ? "dt-breathe" : ""].join(" ")}
      viewBox="0 0 160 160"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="80" cy="134" fill="rgba(94,61,34,0.14)" rx="42" ry="9" />
      {stage === "egg" && (
        <>
          <path
            d="M80 25c28 0 45 37 45 68 0 27-18 43-45 43s-45-16-45-43c0-31 17-68 45-68Z"
            fill="#fff4d5"
            stroke="#8d6848"
            strokeWidth="5"
          />
          <path
            d="M49 92c9-10 16 7 26-2s16-8 25 2 13-6 25 1"
            fill="none"
            stroke="#ffb985"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="65" cy="72" fill="#ffd56b" r="6" />
          <circle cx="96" cy="58" fill="#bde9ff" r="7" />
        </>
      )}
      {stage === "chick" && (
        <>
          <path
            d="M47 90c-21-2-25-25-7-32 17-7 26 13 21 29"
            fill="#ffe28a"
            stroke="#8d6848"
            strokeWidth="5"
          />
          <path
            d="M113 90c21-2 25-25 7-32-17-7-26 13-21 29"
            fill="#ffe28a"
            stroke="#8d6848"
            strokeWidth="5"
          />
          <path
            d="M80 27c29 0 48 26 48 56 0 32-19 51-48 51S32 115 32 83c0-30 19-56 48-56Z"
            fill="#ffd86c"
            stroke="#8d6848"
            strokeWidth="5"
          />
          <path
            d="M64 25c4-9 12-8 16 1 5-10 15-8 17 2"
            fill="none"
            stroke="#8d6848"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="64" cy="73" fill="#553821" r="5" />
          <circle cx="96" cy="73" fill="#553821" r="5" />
          <path
            d="M75 84h10l-5 8-5-8Z"
            fill="#ff8a65"
            stroke="#8d6848"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="M58 103c12 9 32 9 44 0"
            fill="none"
            stroke="#c48635"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )}
      {stage === "bird" && (
        <>
          <path
            d="M42 88c-28-5-31-34-7-43 22-9 36 17 30 41"
            fill="#9bdc86"
            stroke="#356747"
            strokeWidth="5"
          />
          <path
            d="M118 88c28-5 31-34 7-43-22-9-36 17-30 41"
            fill="#9bdc86"
            stroke="#356747"
            strokeWidth="5"
          />
          <path
            d="M80 24c31 0 51 26 51 58 0 34-20 54-51 54S29 116 29 82c0-32 20-58 51-58Z"
            fill="#80c7ed"
            stroke="#356747"
            strokeWidth="5"
          />
          <path
            d="M62 24c5-10 14-9 18 1 6-12 17-8 19 3"
            fill="none"
            stroke="#356747"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <circle cx="63" cy="73" fill="#2f4237" r="5" />
          <circle cx="97" cy="73" fill="#2f4237" r="5" />
          <path
            d="M74 85h12l-6 9-6-9Z"
            fill="#ffd56b"
            stroke="#356747"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="M55 108c13 11 37 11 50 0"
            fill="none"
            stroke="#356747"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </>
      )}
    </svg>
  );
}

export function HomeIllustration({
  level,
  className = "h-24 w-24",
}: IconProps & { level: number }) {
  const isCastle = level >= 5;
  const isCabin = level >= 2;

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 140 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="70" cy="108" fill="rgba(94,61,34,0.14)" rx="48" ry="8" />
      {isCastle ? (
        <>
          <path d="M31 56h78v48H31z" fill="#ffdba3" stroke="#7b5233" strokeWidth="4" />
          <path d="M24 34h24v70H24zM92 34h24v70H92z" fill="#ffc27a" stroke="#7b5233" strokeWidth="4" />
          <path d="M24 34 36 20l12 14M92 34l12-14 12 14" fill="#ff8a65" stroke="#7b5233" strokeLinejoin="round" strokeWidth="4" />
          <path d="M55 104V78c0-10 30-10 30 0v26" fill="#8bbd91" stroke="#7b5233" strokeWidth="4" />
        </>
      ) : isCabin ? (
        <>
          <path d="M30 56h80v48H30z" fill="#ffdba3" stroke="#7b5233" strokeWidth="4" />
          <path d="M22 58 70 24l48 34H22Z" fill="#ff8a65" stroke="#7b5233" strokeLinejoin="round" strokeWidth="4" />
          <path d="M58 104V78h24v26" fill="#8bbd91" stroke="#7b5233" strokeWidth="4" />
          <path d="M40 72h16v14H40zM86 72h16v14H86z" fill="#bde9ff" stroke="#7b5233" strokeWidth="3" />
        </>
      ) : (
        <>
          <path
            d="M24 92c7-32 28-52 46-52s39 20 46 52H24Z"
            fill="#fff4d5"
            stroke="#7b5233"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path d="M70 40v52" stroke="#7b5233" strokeLinecap="round" strokeWidth="4" />
          <path d="M52 92V70c0-8 36-8 36 0v22" fill="#ffb985" stroke="#7b5233" strokeWidth="4" />
        </>
      )}
    </svg>
  );
}

export function IslandScene({
  petLevel,
  homeLevel,
  activeText,
  completedToday,
}: {
  petLevel: number;
  homeLevel: number;
  activeText: string;
  completedToday: number;
}) {
  return (
    <div className="relative mx-auto flex min-h-[360px] w-full max-w-3xl items-center justify-center overflow-hidden rounded-[2rem] border-2 border-white/75 bg-gradient-to-b from-[#bde9ff] via-[#dcf5e4] to-[#f8e9bd] p-4 shadow-inner shadow-white/60 sm:min-h-[430px]">
      <Cloud className="dt-float-slower absolute left-[8%] top-[12%] h-14 w-28 text-white/90" />
      <Cloud className="dt-float-soft absolute right-[9%] top-[20%] h-12 w-24 text-white/80" />
      <Sparkle className="dt-sparkle-pop absolute right-[26%] top-[13%] h-6 w-6 text-[#ffd56b]" />

      <svg
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-48 w-full"
        preserveAspectRatio="none"
        viewBox="0 0 800 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 128C112 70 210 110 304 92c106-21 180-88 308-40 82 31 126 86 188 67v101H0V128Z"
          fill="#9bdc86"
        />
        <path
          d="M0 157c91-35 181-16 259-23 144-13 239-68 367-30 85 26 121 57 174 45v71H0v-63Z"
          fill="#69bd78"
        />
        <path
          d="M128 138c18-18 49-21 75-8M551 124c29-14 58-9 77 10"
          fill="none"
          stroke="#4f9b62"
          strokeLinecap="round"
          strokeWidth="8"
        />
      </svg>

      <Tree className="absolute bottom-[21%] left-[8%] h-24 w-20" />
      <Tree className="absolute bottom-[19%] right-[9%] h-28 w-24" />
      <Flower className="absolute bottom-[25%] right-[24%] h-10 w-10" />
      <Flower className="absolute bottom-[22%] left-[25%] h-9 w-9" />

      <div className="relative z-10 mt-10 flex flex-col items-center">
        <div className="dt-sticker mb-3 px-4 py-2 text-sm font-extrabold text-[var(--dt-ink)]">
          {activeText}
        </div>
        <div className="relative">
          <div className="absolute -left-16 top-12 hidden sm:block">
            <HomeIllustration className="dt-float-soft h-28 w-28" level={homeLevel} />
          </div>
          <PetAvatar className="h-36 w-36 sm:h-44 sm:w-44" level={petLevel} />
          <div className="absolute -right-8 -top-2 rounded-full border-2 border-white bg-[#ffd56b] px-3 py-1 text-xs font-extrabold text-[#5b371f] shadow">
            {completedToday}
          </div>
        </div>
      </div>
    </div>
  );
}

function Cloud({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 140 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 53h88c14 0 22-8 22-18s-8-18-20-18c-5 0-9 1-13 4C94 8 82 3 69 7 59 10 52 17 49 27c-5-4-11-6-18-5-12 2-21 12-20 24 1 5 6 7 13 7Z"
        fill="currentColor"
        stroke="rgba(124,84,47,0.14)"
        strokeWidth="3"
      />
    </svg>
  );
}

function Tree({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M44 56h12v45H44z" fill="#9a6638" stroke="#6b4328" strokeWidth="4" />
      <path
        d="M50 9c20 0 32 20 22 37 18 8 18 34-6 39-13 18-39 12-43-7-19-7-18-32 1-39C19 24 31 9 50 9Z"
        fill="#6fc879"
        stroke="#3f7a4a"
        strokeWidth="4"
      />
      <path d="M34 48c10 8 24 8 33 0" fill="none" stroke="#9be2a0" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function Flower({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M32 35v23" stroke="#4f9b62" strokeLinecap="round" strokeWidth="4" />
      <path d="M32 45c-11-2-15-9-14-17 11 0 17 5 14 17Z" fill="#9bdc86" stroke="#4f9b62" strokeWidth="3" />
      <path d="M32 34c-16-2-16-24 0-18 16-6 16 16 0 18Z" fill="#ffbed0" stroke="#ad5e73" strokeWidth="3" />
      <circle cx="32" cy="27" fill="#ffd56b" r="6" />
    </svg>
  );
}

function Sparkle({ className = "" }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2c2 8 6 12 14 14-8 2-12 6-14 14-2-8-6-12-14-14 8-2 12-6 14-14Z"
        fill="currentColor"
        stroke="#8f6228"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function StoryBadge({ children }: { children: ReactNode }) {
  return (
    <span className="dt-sticker inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-[var(--dt-ink)]">
      {children}
    </span>
  );
}
