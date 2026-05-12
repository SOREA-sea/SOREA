"use client";
import type { NextPage } from "next";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styled, { createGlobalStyle } from "styled-components";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// =============================================================================
// GLOBAL STYLES (identique)
// =============================================================================
const GlobalStyle = createGlobalStyle`
  body { margin: 0; line-height: normal; }
  *, *::before, *::after { box-sizing: border-box; }
  :root {
    --criture: #212121;
    --SOREA: #6a18a4;
    --fonts-family: Roboto;
    --color-black: #000;
    --color-darkslategray: #3a3a40;
    --color-dimgray-100: #4d4d57;
    --color-dimgray-200: rgba(127,102,116,0.7);
    --color-gainsboro: #dadadd;
    --color-gray: rgba(106,24,164,0.04);
    --color-indigo-100: #6d18a4;
    --color-indigo-200: rgba(106,24,164,0.5);
    --color-mediumpurple: rgba(186,152,244,0.2);
    --color-midnightblue: #280267;
    --color-orange: #ffb500;
    --color-slategray-100: #6f7d93;
    --color-slategray-200: #757682;
    --color-white: #fff;
    --font-inria-sans: 'Inria Sans', serif;
    --shadow-drop: 0px 3px 3.1px #ba98f4;
    --shadow-drop-1: 0px 4px 4px rgba(0,0,0,0.25);
    --rubrique2: linear-gradient(259.12deg, #8b47ff, #f498c5);
    --br-20: 20px;
    --br-10: 10px;
    --br-50: 50%;
  }
`;

// =============================================================================
// TYPES
// =============================================================================
type DBCoach = {
  id: number;
  bio: string | null;
  specialty: string | null;
  hourlyRate: number | null;
  averageRating: number | null;
  verified: boolean;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    city: string | null;
  };
  _count: { coachReviews: number };
  // champ calculé côté client pour compatibilité avec CoachCard
  ambassador?: boolean;
};

type AuthState = "connected" | "disconnected";
type DataSource = "db" | "fake";

const INITIAL_VISIBLE = 4;

const MAJOR_FRENCH_CITIES = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
  "Bordeaux",
  "Lille",
  "Rennes",
  "Reims",
  "Le Havre",
  "Saint-Etienne",
  "Toulon",
  "Grenoble",
  "Dijon",
  "Angers",
  "Nimes",
  "Villeurbanne",
  "Le Mans",
  "Aix-en-Provence",
  "Brest",
  "Tours",
  "Amiens",
  "Limoges",
  "Annecy",
  "Perpignan",
  "Boulogne-Billancourt",
  "Metz",
  "Besancon",
  "Orleans",
  "Mulhouse",
  "Rouen",
  "Caen",
  "Nancy",
  "Argenteuil",
  "Montreuil",
  "Saint-Denis",
  "Avignon",
  "Poitiers",
  "Clermont-Ferrand",
] as const;

const FAKE_COACHES: DBCoach[] = [
  {
    id: 1001,
    bio: "Ancienne cadre reconvertie, je t'aide a t'exprimer avec authenticite et assurance.",
    specialty: "Coach en confiance et expression de soi",
    hourlyRate: 60,
    averageRating: 4.8,
    verified: true,
    ambassador: true,
    user: { id: 1001, firstName: "Naima", lastName: "", avatarUrl: "/images/C1@2x.png", city: "Paris 20" },
    _count: { coachReviews: 15 },
  },
  {
    id: 1002,
    bio: "Specialisee en renforcement profond et respiration consciente.",
    specialty: "Kine et Prof de Pilate",
    hourlyRate: 50,
    averageRating: 4.9,
    verified: true,
    ambassador: false,
    user: { id: 1002, firstName: "Camille", lastName: "", avatarUrl: "/images/image-2@2x.png", city: "Paris 20" },
    _count: { coachReviews: 18 },
  },
  {
    id: 1003,
    bio: "Coaching sportif et bienveillant pour renforcer le corps sans pression.",
    specialty: "Coach sportive et equilibre du corps",
    hourlyRate: 55,
    averageRating: 5,
    verified: true,
    ambassador: true,
    user: { id: 1003, firstName: "Lena", lastName: "", avatarUrl: "/images/image-1@2x.png", city: "Paris 20" },
    _count: { coachReviews: 20 },
  },
  {
    id: 1004,
    bio: "Specialisee dans la respiration consciente et la gestion du stress.",
    specialty: "Coach en meditation et relaxation",
    hourlyRate: 45,
    averageRating: 4.7,
    verified: true,
    ambassador: false,
    user: { id: 1004, firstName: "Jade", lastName: "", avatarUrl: "/images/C6@2x.png", city: "Paris 20" },
    _count: { coachReviews: 10 },
  },
  {
    id: 1005,
    bio: "Transitions de vie, objectifs structures avec methode et bienveillance.",
    specialty: "Coach en motivation et performance douce",
    hourlyRate: 50,
    averageRating: 5,
    verified: true,
    ambassador: true,
    user: { id: 1005, firstName: "Chelsey", lastName: "", avatarUrl: "/images/C2@2x.png", city: "Paris 20" },
    _count: { coachReviews: 22 },
  },
  {
    id: 1006,
    bio: "Yoga doux et meditatif pour liberer les tensions.",
    specialty: "Prof de Yoga et plein conscience",
    hourlyRate: 45,
    averageRating: 4.9,
    verified: true,
    ambassador: true,
    user: { id: 1006, firstName: "Mathilde", lastName: "", avatarUrl: "/images/image-6@2x.png", city: "Paris 20" },
    _count: { coachReviews: 14 },
  },
  {
    id: 1007,
    bio: "Exercices pratiques pour te reconnecter a ta force interieure.",
    specialty: "Coach en developpement personnel",
    hourlyRate: 50,
    averageRating: 4.8,
    verified: true,
    ambassador: false,
    user: { id: 1007, firstName: "Loic", lastName: "", avatarUrl: "/images/hermione-pear-qvok07iY5QI-unsplash-1@2x.png", city: "Paris 20" },
    _count: { coachReviews: 16 },
  },
  {
    id: 1008,
    bio: "Sophrologie et visualisation positive pour apaiser le stress.",
    specialty: "Sophrologue et accompagnatrice bien-etre",
    hourlyRate: 40,
    averageRating: 4.9,
    verified: true,
    ambassador: true,
    user: { id: 1008, firstName: "Magalie", lastName: "", avatarUrl: "/images/C3@2x.png", city: "Paris 20" },
    _count: { coachReviews: 11 },
  },
];

// =============================================================================
// SVG ICONS (identiques)
// =============================================================================
const HeartIcon = ({ filled, size = 24 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={filled ? "#6a18a4" : "rgba(78, 60, 83, 0.68)"}
      stroke={filled ? "#6a18a4" : "rgba(106,24,164,0.7)"}
      strokeWidth="1.8"
    />
  </svg>
);

const StarFull = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M6 0.5l1.39 2.82 3.11.45-2.25 2.19.53 3.09L6 7.5 3.22 9.05l.53-3.09L1.5 3.77l3.11-.45L6 0.5z" fill="#FFB500" />
  </svg>
);

const StarEmpty = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M6 0.5l1.39 2.82 3.11.45-2.25 2.19.53 3.09L6 7.5 3.22 9.05l.53-3.09L1.5 3.77l3.11-.45L6 0.5z" fill="none" stroke="#ccc" strokeWidth="1" />
  </svg>
);

const FleurIcon = () => (
  <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3" fill="#6a18a4" />
    <ellipse cx="8" cy="3" rx="2" ry="2.5" fill="#ba98f4" />
    <ellipse cx="8" cy="13" rx="2" ry="2.5" fill="#ba98f4" />
    <ellipse cx="3" cy="8" rx="2.5" ry="2" fill="#d4b5f8" />
    <ellipse cx="13" cy="8" rx="2.5" ry="2" fill="#d4b5f8" />
    <ellipse cx="4.8" cy="4.8" rx="1.8" ry="2.2" fill="#e8d5fc" transform="rotate(45 4.8 4.8)" />
    <ellipse cx="11.2" cy="4.8" rx="1.8" ry="2.2" fill="#e8d5fc" transform="rotate(-45 11.2 4.8)" />
    <ellipse cx="4.8" cy="11.2" rx="1.8" ry="2.2" fill="#e8d5fc" transform="rotate(-45 4.8 11.2)" />
    <ellipse cx="11.2" cy="11.2" rx="1.8" ry="2.2" fill="#e8d5fc" transform="rotate(45 11.2 11.2)" />
    <circle cx="8" cy="8" r="2.5" fill="#fff" />
    <circle cx="8" cy="8" r="1.8" fill="#6a18a4" />
  </svg>
);

const IconPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ba98f4" />
    <circle cx="12" cy="9" r="2.5" fill="#fff" />
  </svg>
);

const IconGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#ba98f4" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#ba98f4" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#ba98f4" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#ba98f4" />
  </svg>
);

const IconChevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 4l4 4 4-4" stroke="#9b6fd9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconArrowDown = () => (
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
    <path d="M7 15L21 29L35 15" stroke="#280267" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// =============================================================================
// STARS DISPLAY
// =============================================================================
const StarsRow = styled.div`display: flex; align-items: center; gap: 2px;`;

const StarsDisplay = ({ rating }: { rating: number }) => {
  const val = rating ?? 0;
  return (
    <StarsRow>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(val) ? <StarFull key={i} /> : <StarEmpty key={i} />
      )}
    </StarsRow>
  );
};

// =============================================================================
// SEARCH BAR (identique)
// =============================================================================
const SearchBarWrapper = styled.div`
  flex: 1;
  width: 100%;
`;

const SearchBarInner = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  width: 100%;
  margin-top: 40px;
  @media (max-width: 980px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 55px;
  gap: 10px;
  border: 0.83px solid rgba(127, 102, 116, 0.7);
  background: rgba(255, 250, 240, 0.2);
  border-radius: 15px;
  position: relative;
  min-width: 0;
  &:focus-within {
    border-color: rgba(139, 71, 255, 0.7);
    box-shadow: 0 0 0 2px rgba(139, 71, 255, 0.12);
  }
`;

const SearchInput = styled.input`
  border: none; outline: none;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1em;
  font-family: var(--font-inria-sans);
  color: #7f6674;
  background: transparent;
  width: 100%;
  &::placeholder { color: #7f6674; }
`;

const DropdownList = styled.ul<{ $visible: boolean }>`
  display: ${p => p.$visible ? "block" : "none"};
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(106,24,164,0.15);
  border: 1.5px solid rgba(186,152,244,0.3);
  list-style: none;
  margin: 0; padding: 6px 0;
  z-index: 50;
  max-height: 220px;
  overflow-y: auto;
`;

const DropdownItem = styled.li<{ $active?: boolean }>`
  padding: 10px 16px;
  font-size: 14px;
  font-family: var(--font-inria-sans);
  color: ${p => p.$active ? "#6a18a4" : "var(--criture)"};
  background: ${p => p.$active ? "rgba(186,152,244,0.12)" : "transparent"};
  cursor: pointer;
  font-weight: ${p => p.$active ? "700" : "400"};
  &:hover { background: rgba(186,152,244,0.12); color: #6a18a4; }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: flex; align-items: center;
  padding: 0 15px;
  height: 55px;
  gap: 10px;
  border: 0.83px solid rgba(127, 102, 116, 0.7);
  background: rgba(255, 250, 240, 0.2);
  border-radius: 15px;
  min-width: 0;
  &:focus-within {
    border-color: rgba(139, 71, 255, 0.7);
    box-shadow: 0 0 0 2px rgba(139, 71, 255, 0.12);
  }
`;

const StyledSelect = styled.select`
  border: none; outline: none;
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.1em;
  font-family: var(--font-inria-sans);
  color: #7f6674;
  background: transparent;
  width: 100%;
  appearance: none;
  cursor: pointer;
  padding-right: 20px;
  option { color: var(--criture); }
`;

const SelectChevron = styled.div`
  position: absolute; right: 15px; top: 50%; transform: translateY(-50%);
  pointer-events: none;
  width: 23px;
  height: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface SearchBarProps {
  cities: string[];
  domains: string[];
  cityFilter: string;
  setCityFilter: (v: string) => void;
  domainFilter: string;
  setDomainFilter: (v: string) => void;
  queryFilter: string;
  setQueryFilter: (v: string) => void;
  onSearch: () => void;
}

const CoachSearchBar = ({
  cities, domains,
  cityFilter, setCityFilter,
  domainFilter, setDomainFilter,
  queryFilter, setQueryFilter,
  onSearch,
}: SearchBarProps) => {
  const [cityInput, setCityInput] = useState(cityFilter === "Toutes les villes" ? "" : cityFilter);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const filteredCities = cities.filter(c =>
    c !== "Toutes les villes" && c.toLowerCase().includes(cityInput.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCity = (city: string) => {
    setCityInput(city);
    setCityFilter(city === "" ? "Toutes les villes" : city);
    setShowDropdown(false);
  };

  return (
    <SearchBarWrapper>
      <SearchBarInner>
        <SearchField ref={dropRef} style={{ position: "relative" }}>
          <IconPin />
          <SearchInput
            placeholder="Choisir une ville"
            value={cityInput}
            onChange={e => { setCityInput(e.target.value); setCityFilter(e.target.value || "Toutes les villes"); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
          />
          <DropdownList $visible={showDropdown && (filteredCities.length > 0 || cityInput === "")}>
            <DropdownItem onClick={() => selectCity("")} $active={cityFilter === "Toutes les villes"}>
              Toutes les villes
            </DropdownItem>
            {filteredCities.map(city => (
              <DropdownItem key={city} onClick={() => selectCity(city)} $active={cityFilter === city}>
                {city}
              </DropdownItem>
            ))}
          </DropdownList>
        </SearchField>

        <SelectWrapper>
          <IconGrid />
          <StyledSelect value={domainFilter} onChange={e => setDomainFilter(e.target.value)}>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </StyledSelect>
          <SelectChevron><IconChevron /></SelectChevron>
        </SelectWrapper>

        <SearchField>
          <SearchInput
            placeholder="Nom d'une séance ou d'un coach"
            value={queryFilter}
            onChange={e => setQueryFilter(e.target.value)}
            onKeyDown={e => e.key === "Enter" && onSearch()}
          />
        </SearchField>
      </SearchBarInner>
    </SearchBarWrapper>
  );
};

// =============================================================================
// FAVORITE BUTTON
// =============================================================================
const FavBtn = styled.button<{ $liked: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 5;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(1.2);
  }

  svg path {
    fill: ${props => props.$liked ? "#ff4d4f" : "rgba(138,71,255,0.18)"};
    stroke: ${props => props.$liked ? "#ff4d4f" : "rgba(138,71,255,0.6)"};
    transition: fill 160ms ease, stroke 160ms ease;
    stroke-width: 2px;
  }
`;

// =============================================================================
// COACH CARD (identique, adapté aux données DB)
// =============================================================================
const CardRoot = styled.div`
  width: 300px; height: 500px; position: relative;
  border-radius: 20px; background: #fff; overflow: hidden; flex-shrink: 0;
  font-family: var(--font-inria-sans);
  box-shadow: 0 4px 20px rgba(0,0,0,0.09);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-5px); box-shadow: 0 10px 36px rgba(106,24,164,0.16); }
`;
const CardImageWrapper = styled.div`width: 100%; height: 300px; position: relative; overflow: hidden;`;
const CardInfoPanel = styled.div`
  position: absolute; bottom: 0; left: 0; width: 100%; height: 200px;
  background: #fff; overflow: hidden;
`;
const RatingRow = styled.div`
  position: absolute; top: 14px; left: 14px;
  display: flex; align-items: center; gap: 5px;
  font-size: 14px; font-family: var(--font-inria-sans); color: var(--criture);
`;
const RatingNum = styled.b`font-weight: 700;`;
const AvisText = styled.span`color: var(--color-slategray-200); font-size: 13px;`;
const AmbassadorBadge = styled.div`
  position: absolute; top: 9px; left: 143px;
  border-radius: 16.5px; background: rgba(186,152,244,0.22);
  border: 1px solid rgba(138,71,255,0.3);
  display: flex; align-items: center; gap: 4px; padding: 4px 8px;
  font-size: 11px; font-family: var(--font-inria-sans); color: #6a18a4; font-weight: 600;
  white-space: nowrap;
`;
const CoachDescArea = styled.div`position: absolute; top: 44px; left: 14px; right: 14px;`;
const CoachTitle = styled.div`
  font-size: 14px; font-weight: 700; font-family: var(--font-inria-sans);
  color: var(--criture); margin-bottom: 5px; line-height: 1.3;
`;
const CoachDesc = styled.div`
  font-size: 12px; color: var(--color-dimgray-100); line-height: 1.45; margin-bottom: 6px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
`;
const CoachPrice = styled.div`font-size: 14px; color: var(--color-indigo-100); font-weight: 700;`;
const NameBanner = styled.div`
  position: absolute;
  top: 248px;
  left: 0;
  width: 100%;
  height: 52px;
  background: rgba(84, 69, 96, 0.68);
  display: flex; flex-direction: column; justify-content: center; padding: 0 12px;
  font-family: var(--font-inria-sans); color: #fff;
  z-index: 4;
`;
const NameMain = styled.span`
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.06em;
`;
const NameSub = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  opacity: 0.95;
  letter-spacing: 0.02em;
`;

interface CoachCardProps {
  coach: DBCoach;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const CoachCard = ({ coach, isFavorite, onToggleFavorite }: CoachCardProps) => {
  const name = coach.user.firstName;
  const city = coach.user.city ?? "";
  const rating = coach.averageRating ?? 0;
  const avisCount = coach._count.coachReviews;
  const price = coach.hourlyRate ? `${coach.hourlyRate}€/séance` : "Sur devis";
  const avatarSrc = coach.user.avatarUrl ?? "/placeholder-coach.png";

  return (
    <CardRoot>
      <CardImageWrapper>
        <Image
          src={avatarSrc}
          alt={name}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
          sizes="300px"
        />
      </CardImageWrapper>

      <FavBtn
        $liked={isFavorite}
        onClick={e => { e.preventDefault(); onToggleFavorite(coach.id); }}
        aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <HeartIcon filled={isFavorite} size={22} />
      </FavBtn>

      <CardInfoPanel>
        <RatingRow>
          <StarFull size={16} />
          <RatingNum>{rating.toFixed(1)}</RatingNum>
          <AvisText>({avisCount} avis)</AvisText>
        </RatingRow>
        {coach.ambassador && (
          <AmbassadorBadge><FleurIcon />Ambassadrice</AmbassadorBadge>
        )}
        <CoachDescArea>
          <CoachTitle>{coach.specialty ?? "Coach"}</CoachTitle>
          <CoachDesc>{coach.bio ?? ""}</CoachDesc>
          <CoachPrice>{price}</CoachPrice>
        </CoachDescArea>
      </CardInfoPanel>

      <NameBanner>
        <NameMain>{name}</NameMain>
        <NameSub>{`${city} (face à face & webcam)`}</NameSub>
      </NameBanner>
    </CardRoot>
  );
};

// =============================================================================
// GRID + VOIR PLUS (identique)
// =============================================================================
const CoachesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 300px);
  gap: 20px;
  justify-content: center;
  width: 100%;
  @media (max-width: 1300px) { grid-template-columns: repeat(3, 300px); }
  @media (max-width: 980px)  { grid-template-columns: repeat(2, 300px); }
  @media (max-width: 640px)  { grid-template-columns: 300px; }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1; text-align: center; padding: 60px 20px;
  font-family: var(--font-inria-sans); color: var(--color-slategray-200); font-size: 18px;
`;

const VoirPlusBtn = styled.button`
  cursor: pointer; border: none; padding: 15px 32px;
  background: #fff; box-shadow: 0 3px 12px rgba(106,24,164,0.18);
  border-radius: 10px; font-size: 15px; letter-spacing: 0.1em;
  font-weight: 900; font-family: Roboto, sans-serif; color: var(--SOREA);
  transition: background 0.2s, color 0.2s, transform 0.15s;
  &:hover { background: var(--SOREA); color: #fff; transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

// =============================================================================
// MODAL CONNEXION REQUISE (identique)
// =============================================================================
const ModalOverlay = styled.div<{ $visible: boolean }>`
  position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
  z-index: 300; display: ${p => p.$visible ? "flex" : "none"};
  align-items: center; justify-content: center;
`;
const ModalBox = styled.div`
  background: #fff; border-radius: 24px; padding: 40px 48px; max-width: 420px; width: 90%;
  text-align: center; box-shadow: 0 20px 60px rgba(106,24,164,0.25);
`;
const ModalTitle = styled.h3`
  margin: 16px 0 10px; font-size: 22px; font-family: var(--font-inria-sans);
  color: var(--SOREA); font-weight: 700;
`;
const ModalText = styled.p`
  margin: 0 0 28px; font-size: 15px; font-family: var(--font-inria-sans);
  color: var(--color-dimgray-100); line-height: 1.5;
`;
const ModalBtnRow = styled.div`display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;`;
const ModalBtnPrimary = styled.button`
  padding: 12px 28px; border-radius: 12px; border: none;
  background: var(--SOREA); color: #fff; font-size: 15px; font-weight: 700;
  font-family: var(--font-inria-sans); cursor: pointer; transition: opacity 0.2s;
  &:hover { opacity: 0.88; }
`;
const ModalBtnSecondary = styled.button`
  padding: 12px 28px; border-radius: 12px; border: 1.5px solid var(--color-gainsboro);
  background: #fff; color: var(--criture); font-size: 15px;
  font-family: var(--font-inria-sans); cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
  &:hover { border-color: var(--SOREA); color: var(--SOREA); }
`;

// =============================================================================
// TESTIMONIALS (identique)
// =============================================================================
const TestimonialsSection = styled.section`
  width: 100%; display: flex; flex-direction: column; align-items: center;
  gap: 40px; background: rgba(106,24,164,0.04); padding: 60px 20px;
`;
const TestiTitle = styled.h2`
  margin: 0 0 12px; font-size: clamp(26px, 4vw, 48px);
  letter-spacing: 0.13em; font-weight: 700;
  font-family: var(--font-inria-sans); color: var(--criture); text-align: center;
`;
const TestiSubtitle = styled.p`
  margin: 0; font-size: clamp(16px, 2.5vw, 28px); letter-spacing: 0.1em; font-weight: 400;
  font-family: var(--font-inria-sans); color: var(--criture); text-align: center;
`;
const TestiCardsRow = styled.div`
  display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 1251px; width: 100%;
`;
const TestiCard = styled.div`
  border-radius: 20px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 22px; width: 370px; max-width: 100%;
  display: flex; flex-direction: column; gap: 12px; font-family: var(--font-inria-sans);
`;
const TestiUser = styled.div`display: flex; align-items: center; gap: 12px;`;
const TestiAvatar = styled.div`
  width: 44px; height: 44px; border-radius: 50%;
  overflow: hidden; position: relative; flex-shrink: 0; background: var(--color-gainsboro);
`;
const TestiName = styled.div`font-size: 16px; font-weight: 800; color: var(--color-darkslategray);`;
const TestiLocation = styled.div`font-size: 13px; color: var(--color-slategray-200);`;
const TestiRatingRow = styled.div`display: flex; align-items: center; gap: 10px;`;
const TestiDate = styled.div`font-size: 13px; color: var(--color-slategray-200); display: flex; align-items: center; gap: 6px;`;
const TestiDot = styled.div`width: 5px; height: 5px; border-radius: 50%; background: var(--color-darkslategray);`;
const TestiText = styled.p`margin: 0; font-size: 14px; line-height: 1.6; color: var(--color-dimgray-100);`;
const TestiReadMore = styled.button`
  background: none; border: none; padding: 0; font-size: 14px; font-weight: 800;
  font-family: var(--font-inria-sans); color: var(--criture);
  text-decoration: underline; cursor: pointer; text-align: left;
`;

const testimonialsData = [
  { name: "Matie C.", location: "Lyon, France", avatar: "/images/Ellipse-1@2x.png", rating: 5, date: "avril 2025", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris..." },
  { name: "Lila C.", location: "Paris, France", avatar: "/images/Ellipse-12@2x.png", rating: 5, date: "avril 2025", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris..." },
  { name: "Hugo B.", location: "Bordeaux, France", avatar: "/images/Ellipse-11@2x.png", rating: 4, date: "avril 2025", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris..." },
];

// =============================================================================
// PAGE LAYOUT STYLED COMPONENTS (identique)
// =============================================================================
const PageWrapper = styled.div`
  width: 100%; min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
  background: linear-gradient(270deg, #FBF7F2 0%, #E2DBEF 100%);
  font-family: var(--font-inria-sans); overflow-x: hidden; padding-top: 84px;
`;
const HeroBanner = styled.section`
  width: 100%;
  max-width: 1304px;
  height: 526px;
  position: relative;
  margin-bottom: 12px;
  @media (max-width: 1100px) {
    height: auto;
    min-height: 420px;
    padding: 24px 20px;
  }
`;

const HeroCopy = styled.div`
  position: absolute;
  width: 749px;
  left: 53px;
  top: 69px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  @media (max-width: 1100px) {
    position: static;
    width: 100%;
    max-width: 749px;
    margin: 0 auto;
  }
`;

const HeroIllustration = styled.div`
  position: absolute;
  width: 526px;
  height: 526px;
  right: 0;
  top: 0;
  @media (max-width: 1100px) {
    position: relative;
    width: min(100%, 420px);
    height: 420px;
    margin: 10px auto 0;
  }
`;

const HeroArrow = styled.div`
  position: absolute;
  left: 404px;
  top: 377px;
  width: 42px;
  height: 42px;
  @media (max-width: 1100px) {
    position: static;
    margin: 12px auto 0;
  }
`;

const PageTitle = styled.h2`
  width: 690px;
  margin: 0;
  font-size: 50px;
  line-height: 60px;
  font-weight: 700;
  color: #212121;
  text-decoration: underline;
  text-underline-offset: 7px;
  letter-spacing: 0.13em;
  text-align: center;
  @media (max-width: 780px) {
    width: 100%;
    font-size: 40px;
    line-height: 48px;
  }
`;

const HeroSubtitle = styled.div`
  width: 749px;
  font-size: 30px;
  line-height: 36px;
  letter-spacing: 0.1em;
  font-weight: 400;
  color: #212121;
  text-align: center;
  @media (max-width: 780px) {
    width: 100%;
    font-size: 22px;
    line-height: 30px;
  }
`;
const SearchSection = styled.div`
  width: 100%;
  max-width: 1248px;
  margin: 10px auto 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  @media (max-width: 980px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 980px) {
    justify-content: flex-end;
  }
`;

const SourceToggle = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 250, 240, 0.35);
  border: 0.83px solid rgba(127, 102, 116, 0.35);
  border-radius: 999px;
  padding: 3px;
  margin-top: 40px;
`;

const SourceBtn = styled.button<{ $active: boolean }>`
  border: none;
  background: ${p => p.$active ? "#6a18a4" : "transparent"};
  color: ${p => p.$active ? "#fff" : "#7f6674"};
  font-family: var(--font-inria-sans);
  font-size: 16px;
  letter-spacing: 0.08em;
  height: 28px;
  min-width: 64px;
  border-radius: 999px;
  cursor: pointer;
  padding: 0 10px;
`;

const GlobalFavCounter = styled.div<{ $hasFavs: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  font-family: 'Roboto Mono', monospace;
  font-size: 18px;
  color: ${p => p.$hasFavs ? "#6a18a4" : "#757682"}; 
  width: 70px;
  height: 60px;
  justify-content: center;
    margin-top: 40px;
  span {
    font-size: 25px;
    line-height: 10px;
    letter-spacing: 1;
    margin-top: 30px;
   transform: translateX(6px);
    
  }
  
  svg path {
    fill: ${p => p.$hasFavs ? "#6a18a4" : "rgba(127, 102, 116, 0.5)"};
    stroke: #ffffff;
    opacity: 1;
    transform: translateX(-2px);
    }
`;

const DomainHeading = styled.h3`
  width: 100%;
  max-width: 1248px;
  margin: 0 0 14px;
  font-size: 50px;
  line-height: 60px;
  letter-spacing: 0.13em;
  color: #6a18a4;
  font-weight: 400;
  text-align: left;
  @media (max-width: 980px) {
    font-size: 36px;
    line-height: 44px;
    text-align: center;
  }
`;
const CoachesSection = styled.section`
  width: 100%; max-width: 1320px;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 20px 60px; gap: 28px;
`;
const ResultsCount = styled.div`
  font-size: 13px; color: var(--color-slategray-200);
  font-family: var(--font-inria-sans); align-self: flex-start; padding-left: 4px;
`;

// =============================================================================
// MAIN PAGE
// =============================================================================
const CoachingPage: NextPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [authState, setAuthState] = useState<AuthState>("disconnected");
  const dataSource: DataSource = searchParams.get("source") === "fake" ? "fake" : "db";

  // Coaches depuis la DB
  const [coaches, setCoaches] = useState<DBCoach[]>([]);
  const [loading, setLoading] = useState(true);

  // Favoris depuis la DB (Set de coachId)
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Filtres
  const [cityFilter, setCityFilter] = useState("Toutes les villes");
  const [domainFilter, setDomainFilter] = useState("Tous les domaines");
  const [queryFilter, setQueryFilter] = useState("");

  // Voir plus
  const [showAll, setShowAll] = useState(false);

  // Modal
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Villes: grandes villes FR + villes issues des coaches charges
  const allCities = [
    "Toutes les villes",
    ...Array.from(
      new Set([
        ...MAJOR_FRENCH_CITIES,
        ...(coaches.map((c) => c.user.city).filter(Boolean) as string[]),
      ]),
    ).sort((a, b) => a.localeCompare(b, "fr")),
  ];
  const allDomains = ["Tous les domaines", ...Array.from(new Set(coaches.map(c => c.specialty).filter(Boolean) as string[])).sort()];

  // ── Vérification session auth ──────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.user) setAuthState("connected");
      })
      .catch(() => {});
  }, []);

  // ── Chargement des coaches ─────────────────────────────────────────────────
  const fetchCoaches = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cityFilter !== "Toutes les villes") params.set("city", cityFilter);
    if (domainFilter !== "Tous les domaines") params.set("domain", domainFilter);
    if (queryFilter) params.set("query", queryFilter);

    if (dataSource === "fake") {
      const q = queryFilter.trim().toLowerCase();
      const filtered = FAKE_COACHES.filter((coach) => {
        const byCity = cityFilter === "Toutes les villes" || (coach.user.city ?? "") === cityFilter;
        const byDomain = domainFilter === "Tous les domaines" || (coach.specialty ?? "").toLowerCase().includes(domainFilter.toLowerCase());
        const byQuery =
          !q ||
          coach.user.firstName.toLowerCase().includes(q) ||
          (coach.user.lastName ?? "").toLowerCase().includes(q) ||
          (coach.specialty ?? "").toLowerCase().includes(q) ||
          (coach.bio ?? "").toLowerCase().includes(q);
        return byCity && byDomain && byQuery;
      });
      setCoaches(filtered);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/coaches?${params.toString()}`);
      const data = await res.json();
      setCoaches(data.coaches ?? []);
    } catch {
      setCoaches([]);
    } finally {
      setLoading(false);
    }
  }, [cityFilter, domainFilter, queryFilter, dataSource]);

  // Chargement initial
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchCoaches();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchCoaches]);

  const handleCityFilterChange = useCallback((value: string) => {
    setShowAll(false);
    setCityFilter(value);
  }, []);

  const handleDomainFilterChange = useCallback((value: string) => {
    setShowAll(false);
    setDomainFilter(value);
  }, []);

  const handleQueryFilterChange = useCallback((value: string) => {
    setShowAll(false);
    setQueryFilter(value);
  }, []);

  const handleDataSourceChange = useCallback((source: DataSource) => {
    setShowAll(false);
    const params = new URLSearchParams(searchParams.toString());
    if (source === "fake") {
      params.set("source", "fake");
    } else {
      params.delete("source");
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  // ── Chargement des favoris ─────────────────────────────────────────────────
  useEffect(() => {
    if (authState !== "connected") return;
    fetch("/api/dashboard/favorites", { credentials: "include" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        // API returns { products, coaches, sessions }
        if (data?.coaches && Array.isArray(data.coaches)) {
          const favIds = data.coaches
            .map((f: { coach?: { id?: number } }) => f.coach?.id)
            .filter((id: number | undefined): id is number => typeof id === "number");
          setFavorites(new Set(favIds));
        }
      })
      .catch(() => {});
  }, [authState]);

  // ── Toggle favori ──────────────────────────────────────────────────────────
  const handleToggleFavorite = useCallback(async (id: number) => {
    if (authState === "disconnected") {
      setShowLoginModal(true);
      return;
    }
    const isFav = favorites.has(id);
    // Optimistic update
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFav) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    try {
      // Use dashboard/favorites POST toggle API
      await fetch("/api/dashboard/favorites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "coach", targetId: id }),
      });
    } catch {
      // rollback si erreur
      setFavorites(prev => {
        const next = new Set(prev);
        if (isFav) {
          next.add(id);
        } else {
          next.delete(id);
        }
        return next;
      });
    }
  }, [authState, favorites]);

  const visibleCoaches = showAll ? coaches : coaches.slice(0, INITIAL_VISIBLE);

  return (
    <>
      <GlobalStyle />
      <Navbar isLoggedIn={authState === "connected"} />

      <PageWrapper>
        <SearchSection>
          <CoachSearchBar
            cities={allCities}
            domains={allDomains}
            cityFilter={cityFilter}
            setCityFilter={handleCityFilterChange}
            domainFilter={domainFilter}
            setDomainFilter={handleDomainFilterChange}
            queryFilter={queryFilter}
            setQueryFilter={handleQueryFilterChange}
            onSearch={fetchCoaches}
          />
          <SearchRight>
            <SourceToggle>
              <SourceBtn $active={dataSource === "db"} onClick={() => handleDataSourceChange("db")}>DB</SourceBtn>
              <SourceBtn $active={dataSource === "fake"} onClick={() => handleDataSourceChange("fake")}>FAKE</SourceBtn>
            </SourceToggle>
            <GlobalFavCounter $hasFavs={favorites.size > 0}>
              <span>{favorites.size}</span>
              <HeartIcon filled={favorites.size > 0} size={80} />
            </GlobalFavCounter>
          </SearchRight>
        </SearchSection>

        <HeroBanner>
          <HeroCopy>
            <PageTitle>Coach</PageTitle>
            <HeroSubtitle>
              Avance à ton rythme avec nos coachs passionnés.
              <br />
              Chaque séance est une étape vers une version
              <br />
              plus sereine de toi-même.
            </HeroSubtitle>
          </HeroCopy>
          <HeroArrow>
            <IconArrowDown />
          </HeroArrow>
          <HeroIllustration>
            <Image src="/images/coah_page_logo.png" alt="Coach dessin" fill style={{ objectFit: "contain", objectPosition: "right center" }} sizes="526px" priority />
          </HeroIllustration>
        </HeroBanner>

        <DomainHeading>Corps et performance douce</DomainHeading>

        <CoachesSection>
          <ResultsCount>
            {loading
              ? "Chargement..."
              : coaches.length === 0
                ? "Aucun coach trouvé"
                : `${coaches.length} coach${coaches.length > 1 ? "s" : ""} trouvé${coaches.length > 1 ? "s" : ""}`
            }
          </ResultsCount>

          <CoachesGrid>
            {loading ? (
              <EmptyState>Chargement des coachs…</EmptyState>
            ) : visibleCoaches.length === 0 ? (
              <EmptyState>
                Aucun coach ne correspond à votre recherche.<br />
                Essayez de modifier les filtres.
              </EmptyState>
            ) : (
              visibleCoaches.map(coach => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  isFavorite={favorites.has(coach.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))
            )}
          </CoachesGrid>

          {!loading && coaches.length > INITIAL_VISIBLE && (
            <VoirPlusBtn onClick={() => setShowAll(prev => !prev)}>
              {showAll ? "Voir moins de coachs" : "Voir les autres coachs"}
            </VoirPlusBtn>
          )}
        </CoachesSection>

        <TestimonialsSection>
          <div style={{ textAlign: "center" }}>
            <TestiTitle>
              <span style={{ textDecoration: "underline" }}>Elles parlent de nos Coachs</span> !
            </TestiTitle>
            <TestiSubtitle>Elles ont osé, elles ont rayonné</TestiSubtitle>
          </div>
          <TestiCardsRow>
            {testimonialsData.map((t, i) => (
              <TestiCard key={i}>
                <TestiUser>
                  <TestiAvatar>
                    <Image src={t.avatar} alt={t.name} fill style={{ objectFit: "cover" }} sizes="44px" />
                  </TestiAvatar>
                  <div>
                    <TestiName>{t.name}</TestiName>
                    <TestiLocation>{t.location}</TestiLocation>
                  </div>
                </TestiUser>
                <TestiRatingRow>
                  <StarsDisplay rating={t.rating} />
                  <TestiDate><TestiDot />{t.date}</TestiDate>
                </TestiRatingRow>
                <TestiText>{t.text}</TestiText>
                <TestiReadMore>En savoir plus</TestiReadMore>
              </TestiCard>
            ))}
          </TestiCardsRow>
        </TestimonialsSection>

        <Footer />
      </PageWrapper>

      <ModalOverlay $visible={showLoginModal} onClick={() => setShowLoginModal(false)}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <HeartIcon filled={false} size={48} />
          <ModalTitle>Connectez-vous pour sauvegarder</ModalTitle>
          <ModalText>
            Créez un compte ou connectez-vous pour ajouter des coachs à vos favoris
            et les retrouver à tout moment.
          </ModalText>
          <ModalBtnRow>
            <ModalBtnPrimary onClick={() => { setShowLoginModal(false); router.push("/login"); }}>
              Se connecter
            </ModalBtnPrimary>
            <ModalBtnSecondary onClick={() => setShowLoginModal(false)}>
              Continuer sans compte
            </ModalBtnSecondary>
          </ModalBtnRow>
        </ModalBox>
      </ModalOverlay>
    </>
  );
};

export default CoachingPage;