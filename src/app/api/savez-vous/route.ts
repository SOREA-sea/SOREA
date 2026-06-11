import { NextResponse } from "next/server";
const CITATIONS_BIEN_ETRE = [
  // ==========================================
  // --- 1. MENTAL, CERVEAU & ÉMOTIONS ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le cerveau ne fait pas la différence entre un vrai et un faux sourire car le simple mouvement mécanique des muscles faciaux déclenche la libération d'endorphines.",
      "Forcez-vous à sourire pendant 60 secondes lors de vos moments de tension. Vous réduirez instantanément votre niveau de stress et tromperez positivement votre système nerveux.",
      "« Sourire est le langage universel de la gentillesse. »\n- William Arthur Ward"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Pratiquer la gratitude chaque jour bloque la production de cortisol, l'hormone du stress, tout en stimulant la dopamine et la sérotonine.",
      "En cultivant cette attitude, vous éclairez naturellement votre esprit. Prenez l'habitude de noter trois aspects positifs de votre journée pour apaiser votre cœur.",
      "« La gratitude transforme ce que nous avons en suffisance. »\n- Melody Beattie"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Écrire ses pensées négatives sur un papier puis le jeter physiquement à la poubelle aide le cerveau à matérialiser la fin d'un problème.",
      "Utilisez cette technique de libération lorsque vos idées vous envahissent. Vous permettrez à votre esprit de tourner la page plus facilement."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'ennui stimule le réseau de mode par défaut de notre cerveau, une zone essentielle qui s'active pour développer la créativité profonde.",
      "Acceptez ces moments de vide sans sauter sur votre téléphone portable. Vous offrirez à votre imagination l'espace nécessaire pour faire naître de nouvelles idées."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Écouter de la musique mélancolique quand l'humeur est sombre déclenche de la prolactine, une hormone qui apporte une sensation biologique de consolation.",
      "Ne refoulez pas vos envies de morceaux tristes lorsque vous traversez une épreuve. Vous aiderez votre corps à extérioriser et à digérer vos émotions."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Méditer régulièrement pendant seulement huit semaines modifie la structure grise du cerveau en réduisant la taille de l'amygdale, le centre de la peur.",
      "Installez-vous au calme quelques minutes par jour pour observer votre respiration. Vous musclerez votre résilience et diminuerez votre anxiété de fond.",
      "« La paix vient de l'intérieur. Ne la cherchez pas à l'extérieur. »\n- Bouddha"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le stress chronique produit des ravages physiques discrets en rétrécissant le cortex préfrontal, l'aire dédiée à la mémoire et à la prise de décision.",
      "Protégez votre capital cérébral en vous accordant de vraies coupures déconnectées. Vous préserverez ainsi vos capacités d'apprentissage et votre clarté mentale.",
      "« Votre calme mental est votre plus grande arme contre les défis de la vie. »\n- Bryant McGill"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Exprimer un remerciement sincère active le système de récompense cérébral chez la personne qui le reçoit mais aussi chez celle qui le formule.",
      "N'hésitez plus à verbaliser votre reconnaissance envers votre entourage au quotidien. Vous améliorerez votre propre humeur tout en renforçant vos relations.",
      "« La gratitude est la mémoire du cœur. »\n- Jean-Baptiste Massillon"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le cerveau humain souffre d'un biais de négativité ancestral qui le pousse à retenir les mauvaises expériences beaucoup plus vite que les moments joyeux.",
      "Prenez conscience de ce mécanisme automatique pour ne pas surévaluer vos échecs. Vous devez faire un effort conscient pour savourer vos petites victoires.",
      "« Ce que nous pensons, nous devenons. »\n- Bouddha"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les activités créatives simples comme le dessin ou le coloriage calment le flux de vos pensées en plongeant vos ondes cérébrales dans un état de transe légère.",
      "Décrochez des écrans et reprenez des crayons pendant un quart d'heure. Vous offrirez à votre mental une pause hautement réparatrice."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les larmes provoquées par une forte émotion contiennent des hormones de stress et des toxines que le corps cherche à expulser pour se réguler.",
      "Autorisez-vous à pleurer sans culpabilité lorsque la pression devient trop forte. Vous permettrez à votre organisme de retrouver son équilibre chimique."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'effet placebo conserve une efficacité thérapeutique mesurable même si vous savez pertinemment que le remède ingéré ne contient aucun principe actif.",
      "Faites confiance aux rituels de soin que vous mettez en place, comme une simple tisane du soir. Vous activerez les capacités d'autoguérison de votre esprit."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Caresser un animal domestique pendant une dizaine de minutes fait chuter la tension artérielle et déclenche une vague d'ocytocine apaisante.",
      "Prenez le temps de vous connecter avec vos compagnons à quatre pattes après une dure journée. Vous rechargerez vos batteries affectives immédiatement."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Se parler à soi-même en utilisant la troisième personne ou votre propre prénom permet de prendre une distance psychologique salvatrice face aux difficultés.",
      "Remplacez le 'je panique' par un encourageant 'tu vas y arriver' lors de vos prochains défis. Vous réduirez l'emprise de l'anxiété sur vos décisions.",
      "« Vous êtes suffisamment fort pour faire face à vos défis, assez talentueux pour réaliser vos rêves. »\n- Roy T. Bennett"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Ruminer les mêmes problèmes en boucle consomme une quantité astronomique de glucose, ce qui crée une véritable sensation d'épuisement physique.",
      "Rompez le cercle vicieux de vos pensées en changeant immédiatement d'activité ou de pièce. Vous économiserez votre énergie pour des actions constructives.",
      "« Vous ne pouvez pas toujours contrôler ce qui se passe à l'extérieur, mais vous pouvez toujours contrôler ce qui se passe à l'intérieur. »\n- Wayne Dyer"
    ]
  },

  // ==========================================
  // --- 2. CORPS, SENSATION & PHYSIQUE ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Marcher pieds nus sur un sol naturel comme l'herbe ou le sable permet de décharger l'électricité statique corporelle et d'absorber les électrons de la Terre.",
      "Pratiquez régulièrement ce retour aux sources dès que la météo le permet. Vous réduirez ainsi les inflammations chroniques de vos tissus."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les arbres sécrètent des molécules volatiles protectrices appelées phytoncides qui stimulent notre système immunitaire lorsque nous les respirons.",
      "Allez marcher en forêt pour vous offrir un véritable traitement préventif. Vous augmenterez votre taux de globules blancs pour plusieurs jours."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Regarder un paysage de nature ou une simple photographie d'espaces verts pendant 40 secondes permet au cortex visuel de restaurer son attention.",
      "Levez les yeux de vos dossiers et observez l'extérieur à intervalles réguliers. Vous soulagerez votre fatigue mentale sans perdre de temps."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le rire dilate les vaisseaux sanguins et augmente le flux d'oxygen, provoquant des effets cardiovasculaires similaires à un effort physique modéré.",
      "Recherchez activement des occasions de vous amuser et de partager des éclats de rire. Vous musclerez votre cœur tout en libérant vos tensions."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'étirer intensément au réveil relance la circulation de la lymphe et réaligne les fascias qui se sont figés pendant la nuit.",
      "Imitez le geste de pandiculation des animaux avant de sauter du lit. Vous réveillerez votre système nerveux en douceur et éviterez les blocages.",
      "« Prenez soin de votre corps. C'est le seul endroit où vous devez vivre. »\n- Jim Rohn"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un jet d'eau froide appliqué sur la nuque ou le visage à la fin de la douche stimule instantanément le nerf vague et ralentit le cœur.",
      "Osez affronter la fraîcheur pendant quelques secondes avant de sortir de votre salle de bain. Vous renforcerez votre tolérance naturelle face aux coups de stress."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Rester assis de manière avachie comprime la cage thoracique et peut réduire le volume d'air inspiré par vos poumons de près de 30%.",
      "Redressez votre colonne et roulez vos épaules vers l'arrière plusieurs fois par jour. Vous redonnerez de l'espace à votre souffle et gagnerez en vitalité."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'exposer aux rayons du soleil durant l'heure qui suit le réveil donne le signal d'arrêt de la mélatonine et synchronise notre horloge biologique.",
      "Prenez votre café sur le balcon ou marchez un moment à l'extérieur le matin. Vous programmerez votre corps à être énergique durant toute la journée."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le massage stimule les récepteurs cutanés profonds, ce qui bloque la transmission des signaux douloureux vers la moelle épinière.",
      "N'attendez pas de souffrir pour prendre soin de vos muscles fatigués. Vous favoriserez la production d'endorphines, vos analgésiques naturels."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une marche active de seulement vingt minutes par jour diminue de plus d'un quart le risque d'entrer dans un état dépressif.",
      "Faites de ce déplacement quotidien une priorité non négociable dans votre emploi du temps. Vous protégerez votre équilibre psychique par le mouvement."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Chanter en groupe synchronise les rythmes cardiaques des participants sur le tempo de la musique en raison des phases de respiration communes.",
      "Rejoignez une chorale ou chantez en chœur lors de vos moments collectifs. Vous ressentirez un profond sentiment de calme et de connexion humaine."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'inhalation de l'essence de lavande active les récepteurs GABA dans le cerveau, entraînant une baisse mesurable de la pression artérielle.",
      "Diffusez quelques gouttes de cette huile essentielle dans votre chambre avant de vous coucher. Vous glisserez vers le sommeil avec beaucoup plus de facilité."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'immerger dans un bain chaud augmente la dépense énergétique car l'organisme doit travailler activement pour réguler sa température interne.",
      "Accordez-vous ce moment de détente pour soulager vos articulations lourdes. Vous brûlerez des calories tout en apaisant votre système nerveux périphérique."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Regarder un écran fixe force les yeux à focaliser à la même distance, ce qui fatigue prématurément les muscles ciliaires de l'œil.",
      "Appliquez la règle du 20-20-20 en fixant un point à six mètres pendant vingt secondes toutes les vingt minutes. Vous éviterez les migraines ophtalmiques."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'air confiné à l'intérieur de nos logements concentre les polluents domestiques et s'avère souvent plus toxique que l'atmosphère de la rue.",
      "Ouvrez grand vos fenêtres pendant dix minutes chaque matin, peu importe la saison. Vous renouvellerez votre oxygène et purifierez votre espace de vie.",
      "« La santé est la plus grande possession. Le contentement est le plus grand trésor. »\n- Lao Tseu"
    ]
  },
];


export async function GET() {
const dayIndex = Math.floor((Date.now() + 86400000*80) / 86400000) % CITATIONS_BIEN_ETRE.length;
  const citation = CITATIONS_BIEN_ETRE[dayIndex];

  return NextResponse.json(citation, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600" },
  });
}