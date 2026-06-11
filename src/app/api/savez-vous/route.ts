import { NextResponse } from "next/server";
const CITATIONS_BIEN_ETRE = [
  {
    title: "Citation du jour",
    paragraphs: [
      "« La gratitude transforme ce que nous avons en suffisance. »",
      "- Melody Beattie",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Prendre soin de soi n'est pas un luxe, c'est une nécessité. »",
      "- Audre Lorde",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le bonheur n'est pas quelque chose de tout fait. Il vient de vos propres actions. »",
      "- Dalaï Lama",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Votre calme mental est votre plus grande arme contre les défis de la vie. »",
      "- Bryant McGill",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La pleine conscience consiste à être présent dans tout ce que vous faites. »",
      "- Oprah Winfrey",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Respirez. Lâchez prise. Et rappelez-vous que ce moment est le seul dont vous ayez besoin. »",
      "- Oprah Winfrey",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Écrire dans un journal vous rappelle vos objectifs, vos aspirations et vos rêves. »",
      "- Deepak Chopra",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le sommeil est la meilleure méditation. »",
      "- Dalaï Lama",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Prenez soin de votre corps. C'est le seul endroit où vous devez vivre. »",
      "- Jim Rohn",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La joie est ce qui se passe quand nous permettons à nous-mêmes de reconnaître que tout va bien. »",
      "- Marianne Williamson",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le secret du changement est de concentrer toute votre énergie non pas à lutter contre l'ancien, mais à construire le nouveau. »",
      "- Socrate",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur. »",
      "- Bouddha",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Ce que nous pensons, nous devenons. »",
      "- Bouddha",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Chaque jour est une nouvelle chance de changer votre vie. »",
      "- Anonyme",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La gratitude est la mémoire du cœur. »",
      "- Jean-Baptiste Massillon",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Vous ne pouvez pas toujours contrôler ce qui se passe à l'extérieur, mais vous pouvez toujours contrôler ce qui se passe à l'intérieur. »",
      "- Wayne Dyer",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La santé est la plus grande possession. La contentement est le plus grand trésor. »",
      "- Lao Tseu",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Soyez vous-même le changement que vous voulez voir dans le monde. »",
      "- Gandhi",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le bonheur est un voyage, pas une destination. »",
      "- Ben Sweetland",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Aimez-vous vous-même d'abord, et tout le reste s'alignera. »",
      "- Lucille Ball",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le moment présent est le seul moment disponible pour nous, et c'est la porte de tous les moments. »",
      "- Thich Nhat Hanh",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Sourire est le langage universel de la gentillesse. »",
      "- William Arthur Ward",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Chaque matin, nous naissons à nouveau. Ce que nous faisons aujourd'hui compte le plus. »",
      "- Bouddha",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La vraie paix n'est pas l'absence de conflit, c'est la capacité à gérer le conflit par des moyens pacifiques. »",
      "- Ronald Reagan",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Nourrissez votre esprit avec de grandes pensées car vous ne irez jamais plus haut que vous ne pensez. »",
      "- Benjamin Disraeli",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le vrai bonheur consiste à rendre les autres heureux. »",
      "- Baden Powell",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La vie est trop courte pour être petite. »",
      "- Benjamin Disraeli",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Faites chaque jour quelque chose qui vous fait peur. »",
      "- Eleanor Roosevelt",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le courage c'est d'aller de l'avant malgré la peur, pas l'absence de peur. »",
      "- Ambrose Redmoon",
    ],
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Vous êtes suffisamment fort pour faire face à vos défis, assez talentueux pour réaliser vos rêves. »",
      "- Roy T. Bennett",
    ],
  },
];

export async function GET() {
const dayIndex = Math.floor((Date.now() + 86400000*2) / 86400000) % CITATIONS_BIEN_ETRE.length;
  const citation = CITATIONS_BIEN_ETRE[dayIndex];

  return NextResponse.json(citation, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
  });
}