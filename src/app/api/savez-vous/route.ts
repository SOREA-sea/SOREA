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

  // ==========================================
  // --- UNIQUE CITATION INSERTION (1/2) ---
  // ==========================================
  {
    title: "Citation du jour",
    paragraphs: [
      "« Prendre soin de soi n'est pas un luxe, c'est une nécessité. »",
      "- Audre Lorde"
    ]
  },

  // ==========================================
  // --- 3. NUTRITION & SANTÉ INTESTINALE ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le système nerveux entérique de notre intestin abrite des millions de neurones et élabore la quasi-totalité de la sérotonine présente dans le corps.",
      "Chouchoutez votre transit en consommang des fibres et des produits bruts. Vous agirez directement sur la qualité de votre santé mentale."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un manque de déshydratation minime diminue le volume sanguin, ce qui prive le cerveau d'une irrigation optimale et génère des maux de tête.",
      "Gardez toujours une gourde remplie de liquide sur votre plan de travail. Vous chasserez les coups de pompe de l'après-midi en buvant régulièrement."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le chocolat noir riche en cacao regorge de flavonoïdes, des molécules antioxydantes qui augmentent l'apport de sang vers les zones clés de la mémoire.",
      "Savourer un carré de chocolat à forte concentration de cacao sans culpabilité. Vous joindrez l'utile à l'agréable pour soutenir vos fonctions cognitives."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les produits fermentés comme le kéfir contiennent des bactéries vivantes capables de modifier positivement la composition de la flore intestinale.",
      "Ajoutez ces super-aliments à vos menus hebdomadaires. Vous renforcerez votre barrière immunitaire et diminuerez l'anxiété de fond."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le cerveau requiert environ vingt minutes pour intercepter les signaux hormonaux de satiété envoyés par l'estomac au cours d'un repas.",
      "Posez vos couverts entre chaque bouchée et apprenez à mastiquer longuement. Vous éviterez les lourdeurs digestives et régulerez votre poids sans effort."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le magnésium intervient dans des centaines de réactions enzymatiques et reste indispensable pour freiner l'hyperexcitabilité de nos cellules nerveuses.",
      "Misez sur les oléagineux, le cacao brut et les légumes verts si vous vous sentez tendus. Vous offrirez à votre corps un décontractant naturel."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Consommer de la caféine dès le saut du lit bloque l'action bénéfique du pic de cortisol produit naturellement par votre corps pour vous réveiller.",
      "Patientez au moins une heure après votre réveil avant de faire couler votre première tasse. Vous profiterez d'une énergie plus stable sans subir de crash."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les acides gras oméga-3 s'intègrent directement dans les membranes cellulaires de notre cerveau, garantissant la bonne fluidité des échanges nerveux.",
      "Consommez régulièrement des petits poissons gras ou des graines de lin. Vous entretiendrez la vivacité de votre mémoire et protégerez vos neurones."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le sucre blanc industriel provoque d'intenses variations de la glycémie qui fatiguent l'organisme et déclenchent des sautes d'humeur imprévisibles.",
      "Remplacez les douceurs raffinées par des fruits frais ou des sucres complets. Vous éviterez les montagnes russes émotionnelles au fil de la journée."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La banane renferme de belles quantités de tryptophane, un acide aminé essentiel utilisé par l'organisme pour fabriquer la sérotonine.",
      "Glissez ce fruit dans votre sac pour vos collations de milieu de journée. Vous soutiendrez votre bonne humeur de manière simple et saine."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La camomille contient de l'apigénine, un antioxydant qui se fixe sur les mêmes zones cérébrales que les molécules apaisantes pour calmer l'esprit.",
      "Préparez-vous une infusion de fleurs séchées avant de vous installer pour votre soirée. Vous signalerez doucement à votre système nerveux qu'il peut se détendre."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La curcumine issue du curcuma gagne une biodisponibilité multipliée par mille lorsqu'elle est combinée avec la pipérine du poivre noir.",
      "Associez toujours ces deux épices dans vos préparations culinaires chaudes. Vous offrirez à vos articulations un puissant bouclier anti-inflammatoire."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les pigments colorés des légumes signalent la présence de polyphénols spécifiques capables de neutraliser les radicaux libres responsables du vieillissement.",
      "Composez des assiettes multicolores et variées en faisant le plein de végétaux. Vous garantirez à vos cellules une protection antioxydante complète."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le thé vert héberge de la L-théanine, un acide aminé rare qui augmente la production d'ondes alpha dans le cerveau pour détendre sans endormir.",
      "Adoptez cette boisson lors de vos sessions d'étude ou de travail exigeantes. Vous obtiendrez un état de vigilance calme et parfaitement focalisé."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le système digestif se met au ralenti durant la nuit, ce qui nécessite un amorçage hydrique doux pour nettoyer les résidus métaboliques au matin.",
      "Buvez un grand verre d'eau tempérée immédiatement après être sortis du lit. Vous réactiverez vos reins et réveillerez vos organes profonds."
    ]
  },

  // ==========================================
  // --- UNIQUE CITATION INSERTION (2/2) ---
  // ==========================================
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le bonheur n'est pas quelque chose de tout fait. Il vient de vos propres actions. »",
      "- Dalaï Lama"
    ]
  },

  // ==========================================
  // --- 4. SOMMEIL, REPOS & RYTHMES ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Dépasser vingt minutes de sieste vous fait sombrer dans un cycle de sommeil lourd dont il est extrêmement difficile d'émerger sans séquelles.",
      "Réglez scrupuleusement votre réveil lorsque vous fermez les yeux en journée. Vous profiterez d'un élan de fraîcheur sans subir la lourdeur de l'inertie.",
      "« Le sommeil est la meilleure méditation. »\n- Dalaï Lama"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le système glymphatique s'ouvre durant le sommeil profond pour faire circuler le liquide céphalo-rachidien et balayer les protéines toxiques cérébrales.",
      "Priorisez vos heures de repos nocturne sans faire d'impasse sur vos cycles. Vous permettrez à votre cerveau d'effectuer son grand nettoyage quotidien."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La lumière bleue émise par les diodes des tablettes fait croire à la rétine qu'il fait encore grand jour, bloquant l'arrivée de la mélatonine.",
      "Éteignez vos outils numériques au moins une heure avant l'extinction des feux. Vous retrouverez un endormissement rapide et des nuits bien plus sereines."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le corps humain doit abaisser sa température interne d'environ un degré pour pouvoir déclencher les mécanismes biochimiques de l'endormissement.",
      "Maintenez le thermostat de votre espace de repos autour de 18°C maximum. Vous éviterez les réveils précoces et les agitations nocturnes."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le rythme respiratoire 4-7-8 force l'activation du système parasympathique en saturant le sang en oxygène avant de ralentir le rythme cardiaque.",
      "Utilisez cette technique de respiration rythmée lorsque l'insomnie vous guette. Vous apaiserez le flux de vos pensées et glisserez vers le repos.",
      "« Respirez. Lâchez prise. Et rappelez-vous que ce moment est le seul dont vous ayez besoin. »\n- Oprah Winfrey"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'esprit humain requiert un délai moyen de 66 jours de pratique quotidienne pour ancrer un comportement inédit au rang d'automatisme inconscient.",
      "Faites preuve de patience et de bienveillance envers vous-mêmes lors de vos changements de vie. Ne baissez pas les bras après seulement deux semaines.",
      "« Le secret du changement est de concentrer toute votre énergie non pas à lutter contre l'ancien, mais à construire le nouveau. »\n- Socrate"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Ordonner son espace de couchage dès le matin envoie un signal visuel de clarté qui influence la disposition mentale pour le reste de la journée.",
      "Prenez l'habitude de faire votre lit juste après votre lever. Vous commencerez vos journées par une première victoire concrète et ordonnée.",
      "« Chaque matin, nous naissons à nouveau. Ce que nous faisons aujourd'hui compte le plus. »\n- Bouddha"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Pratiquer la cohérence cardiaque pendant cinq minutes réduit immédiatement le taux de cortisol sanguin pour une durée remarquable de cinq heures.",
      "Répétez cet exercice de respiration trois fois par jour pour couper l'élan de l'anxiété. Vous protégerez efficacement votre cœur des méfaits de la tension."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le manque de repos nocturne perturbe la ghréline et la leptine, deux hormones clés qui contrôlent les sensations de faim et de satiété.",
      "Veillez à dormir suffisamment si vous tentez d'équilibrer vos repas. Vous éviterez les fringales compulsives de produits gras le lendemain."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Chaque signal sonore ou vibration de votre smartphone déclenche une micro-décharge de dopamine qui fragmente votre concentration de manière toxique.",
      "Pensez à désactiver toutes les notifications superflues de vos applications mobiles. Vous retrouverez un calme intérieur et une attention de qualité."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Prendre une douche bien chaude dilate les vaisseaux cutanés, ce qui provoque une chute rapide de la température interne dès que vous en sortez.",
      "Planifiez ce passage à la salle de bain une heure et demie avant d'aller au lit. Vous imiterez le signal biologique naturel qui appelle le sommeil."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Conserver une heure de réveil identique les jours de repos prévient le phénomène de décalage horaire social qui épuise l'organisme.",
      "Évitez les grasses matinées excessives qui bousculent vos cycles biologiques internes. Vous vous sentirez beaucoup plus dynamiques dès le lundi matin.",
      "« Chaque jour est une nouvelle chance de changer votre vie. »\n- Anonyme"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le cerveau humain s'avère incapable d'exécuter deux tâches complexes en même temps, passant simplement d'un sujet à l'autre en usant ses réserves.",
      "Concentrez-vous sur une seule action à la fois pour gagner en efficacité. Vous diminuerez votre niveau de fatigue intellectuelle de moitié."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Des étirements légers réalisés avant le coucher libèrent les tensions accumulées dans l'appareil locomoteur et évitent les raideurs nocturnes.",
      "Prenez de cinq minutes pour assouplir vos articulations sur le tapis de votre chambre. Vous enverrez à vos muscles le signal de la décontraction totale."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Vérifier l'heure lors d'un réveil nocturne déclenche une analyse mathématique anxiogène qui réveille le cortex préfrontal et bloque le rendormissement.",
      "Retournez vos cadrans et éloignez vos téléphones de votre table de chevet. Vous éviterez de stresser pour le temps qu'il vous reste à dormir."
    ]
  },

  // ==========================================
  // --- 5. ENVIRONNEMENT, HABITAT & SENS ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La présence de plantes vertes au sein d'une pièce filtre certains polluants et augmente la productivité des occupants de près de 15%.",
      "Installez quelques végétaux robustes sur vos meubles de bureau ou dans votre salon. Vous purifierez votre atmosphère tout en apaisant votre regard."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un espace encombré sature le cortex visuel en envoyant trop d'informations au cerveau, ce qui maintient un niveau de stress latent.",
      "Prenez le temps de trier et d'épurer régulièrement votre environnement immédiat. Vous libérerez de l'espace dans vos pièces et dans vos pensées."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Travailler sous une source de lumière naturelle optimise les performances de mémorisation par rapport à un éclairage exclusivement fluorescent.",
      "Rapprochez votre table de travail des fenêtres et ouvrez vos rideaux en grand. Vous soutiendrez vos capacités intellectuelles sans fatiguer vos yeux."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'arôme de la menthe poivrée stimule les récepteurs sensoriels liés à la vigilance, augmentant instantanément le niveau d'éveil de l'esprit.",
      "Gardez un flacon de cette huile essentielle à portée de main lors de vos sessions d'étude. Vous chasserez la somnolence d'un simple geste."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les fréquences sonores des vagues ou de la pluie calment l'activité du système nerveux sympathique pour activer le mode de récupération profonde.",
      "Diffusez ces mélodies de la nature en fond sonore lors de vos moments de lecture. Vous créerez une bulle de tranquillité propice au relâchement."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La perception des teintes bleues et vertes déclenche des réactions physiologiques qui ralentissent le rythme cardiaque et calment la tension.",
      "Intégrez ces nuances colorées dans la décoration de vos espaces de repos. Vous favoriserez une ambiance relaxante idéale pour décompresser."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les éclairages trop vifs en fin de journée perturbent l'horloge interne en simulant la clarté d'un soleil au zénith.",
      "Privilégiez les lampes d'appoint et les lumières chaudes dès que le soir tombe. Vous préparerez votre corps à basculer vers une nuit réparatrice."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Aérer sa literie tous les matins dissipe l'humidité accumulée et freine drastiquement la prolifération des acariens responsables d'allergies.",
      "Laissez votre lit ouvert pendant un quart d'heure en ouvrant la fenêtre de votre chambre. Vous assainirez votre espace de couchage pour la nuit suivante."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une température ambiante fixée autour de 21°C constitue le parfait équilibre thermique pour travailler sans gaspiller d'énergie corporelle.",
      "Ajustez vos thermostats professionnels pour éviter les excès de froid ou de chaud. Vous maintiendrez une excellente concentration sur la durée."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'essence d'orange douce inhalée réduit l'activité des hormones du stress lors d'événements générateurs d'anxiété.",
      "Déposez une goutte de cet agrume sur un mouchoir avant un rendez-vous important. Vous profiterez de ses vertus pour stabiliser votre respiration."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les intérieurs qui intègrent des textures en bois brut provoquent une diminution mesurable de la tension artérielle des résidents.",
      "Privilégiez les matériaux authentiques et naturels pour aménager votre logement. Vous transformerez votre foyer en un véritable havre de paix."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un silence trop absolu peut paradoxalement amplifier la perception des acouphènes et générer un inconfort psychologique permanent.",
      "Utilisez des bruits blancs discrets ou le murmure d'un ventilateur si le vide sonore vous oppresse. Vous calmerez la vigilance automatique de votre cerveau."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Laver régulièrement ses rideaux et secouer ses tapis élimine les micro-poussières qui altèrent la qualité de notre respiration nocturne.",
      "Prenez soin de nettoyer vos textiles de maison à intervalles réguliers. Vous offrirez à vos poumons un air plus pur pour un sommeil de meilleure qualité."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Masquer la présence visuelle de votre téléphone pendant une tâche élimine l'effort inconscient requis pour résister à la tentation de le consulter.",
      "Glissez votre appareil dans un tiroir ou laissez-le dans votre sac pendant vos heures d'étude. Vous décuplerez votre efficacité sans frustration."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une simple balade dans un square urbain offre des bénéfices de récupération mentale comparables à une immersion en pleine campagne.",
      "Ne négligez pas les petits parcs proches de votre lieu de travail pour vos pauses. Vous permettrez à votre esprit de déconnecter efficacement.",
      "« Soyez vous-même le changement que vous voulez voir dans le monde. »\n- Gandhi"
    ]
  },

  // ==========================================
  // --- 6. LIENS SOCIAUX & EMPATHIE ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un contact physique bienveillant prolongé de vingt secondes déclenche une libération massive d'ocytocine, l'hormone du lien social.",
      "Serrez vos proches chaleureusement dans vos bras dès que l'occasion se présente. Vous ferez chuter mutuellement votre niveau de stress."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Entretenir des conversations authentiques et profondes améliore l'humeur générale bien plus sûrement que les échanges superficiels.",
      "Osez dépasser les banalités quotidiennes lors de vos rencontres d'amis. Vous encouragerez une dynamique d'ouverture mutuelle unique."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'isolement social prolongé active les réseaux neuronaux de la douleur, démontrant que l'être humain est câblé pour vivre au sein d'un groupe.",
      "Prenez régulièrement des nouvelles de votre entourage ou rejoignez des clubs associatifs. Vous protégerez votre moral en restant connectés au monde."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Accomplir un acte de gentillesse envers autrui libère instantanément des endorphines chez l'auteur de l'action, générant un bien-être durable.",
      "Rendez de petits services de manière désintéressée au fil de vos journées. Vous illuminerez le quotidien de quelqu'un tout en soignant votre bonheur.",
      "« Le vrai bonheur consiste à rendre les autres heureux. »\n- Baden Powell"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Écouter attentivement un interlocuteur sans l'interrompre active les neurones miroirs, favorisant un climat de confiance immédiat.",
      "Offrez une présence totale et silencieuse lorsque vos proches se confient à vous. Vous leur permettrez de se sentir compris et acceptés."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La lecture de romans de fiction développe les zones cérébrales liées à l'empathie en nous forçant à adopter la perspective de personnages variés.",
      "Plongez-vous régulièrement dans de belles histoires littéraires. Vous affinerez votre intelligence émotionnelle et comprendrez mieux les autres."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Prendre son repas en compagnie de convives stimule la sécrétion d'endorphines, indépendamment de la nature des aliments partagés.",
      "Privilégiez les déjeuners partagés plutôt que de manger seuls devant vos dossiers de travail. Vous transformerez vos pauses en de vrais moments de détente."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Exprimer des mots d'affection à ceux que l'on aime régule le rythme cardiaque de l'émetteur de façon synchrone avec celui du récepteur.",
      "Prenez le temps de dire des mots gentils à vos proches avant de les quitter. Vous ancrerez un sentiment de sécurité partagé au sein de votre foyer."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les émotions s'avèrent contagieuses en raison de notre tendance naturelle à imiter inconsciemment les expressions de nos interlocuteurs.",
      "Choisissez de vous entourer de personnes optimistes et enthousiastes le plus souvent possible. Vous élèverez votre propre niveau de motivation."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le sentiment d'exclusion sociale emprunte les mêmes circuits physiques que la douleur causée par une blessure corporelle réelle.",
      "Faites preuve d'inclusion et de bienveillance envers vos nouveaux collègues ou voisins. Vous éviterez des souffrances invisibles et sèmerez l'harmonie."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'engager de manière bénévole au service d'une cause donne un sens profond à l'existence, ce qui protège de l'épuisement émotionnel.",
      "Donnez un peu de votre temps libre à des projets qui vous tiennent à cœur. Vous renforcerez votre estime personnelle tout en vous rendant utiles."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les débats agressifs sur les réseaux sociaux maintiennent le cerveau dans un état d'alerte défensif épuisant pour nos réserves psychiques.",
      "Sachez couper court aux fils de discussions stériles en ligne. Vous préserverez votre énergie pour des interactions réelles et constructives."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Présenter des excuses sincères après un conflit fait chuter la tension artérielle de la personne offensée et libère l'émetteur de sa culpabilité.",
      "Mettez votre ego de côté et apprenez à reconnaître vos torts avec franchise. Vous restaurerez la paix au sein de vos relations professionnelles.",
      "« La vraie paix n'est pas l'absence de conflit, c'est la capacité à gérer le conflit par des moyens pacifiques. »\n- Ronald Reagan"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Solliciter le soutien d'un proche renforce l'estime de soi de ce dernier en valorisant ses compétences et son importance à vos yeux.",
      "Ne traversez pas vos épreuves dans un silence farouche. Apprenez à accepter l'aide extérieure pour alléger votre charge et resserrer vos liens."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Rire de concert face à une situation insolite synchronise instantanément les ondes cérébrales des spectateurs présents.",
      "Partagez des moments d'humour et de légèreté avec vos compagnons d'équipe. Vous briserez les barrières de glace et créerez une belle complicité."
    ]
  },

  // ==========================================
  // --- 7. PRODUCTIVITÉ, FOCUS & RESSOURCES ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'accorder une pause complète toutes les heures permet de recharger les réserves de glucose utilisées par notre attention soutenue.",
      "Levez-vous de votre bureau pour marcher quelques instants au lieu de travailler sans interruption. Vous garderez une efficacité optimale jusqu'au soir."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La méthode Pomodoro alterne des sessions de concentration pure et de courts repos afin de respecter les rythmes cognitifs naturels du cerveau.",
      "Mettez en place des blocs d'effort de 25 minutes suivis de 5 minutes de détente. Vous accomplirez vos tâches complexes sans ressentir de fatigue."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "L'attention humaine ne s'avère pas extensible à l'infini et commence à décliner de manière drastique après 90 minutes de focalisation continue.",
      "Respectez ces limites biologiques en variant la nature de vos activités professionnelles au fil des heures. Vous éviterez les erreurs dues à la fatigue."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Dire non aux demandes secondaires protège votre capital de concentration pour le dédier pleinement à vos projets essentiels.",
      "Apprenez à fixer des limites claires avec politesse mais fermeté lors de vos journées chargées. Vous gagnerez du temps pour vos propres objectifs."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Limiter votre liste d'objectifs quotidiens à trois priorités absolues élimine le sentiment de débordement qui paralyse l'action.",
      "Sélectionnez vos défis majeurs chaque matin avant de consulter vos e-mails. Vous avancerez avec sérénité sans vous éparpiller dans l'urgence."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Les musiques d'ambiance dénuées de paroles soutiennent l'attention en évitant de surcharger les zones de traitement linguistique du cerveau.",
      "Privilégiez les morceaux classiques ou les rythmes lo-fi durant vos séances de rédaction. Vous créerez un cocon propice à un travail fluide."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Traiter le dossier le plus complexe dès le début de la matinée libère l'esprit du poids de la procrastination pour tout le reste de la journée.",
      "Prenez l'habitude d'attaquer votre plus grand défi dès votre arrivée au bureau. Vous aborderez la suite de vos obligations avec une immense légèreté."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Noter toutes ses tâches urgentes en vrac sur un support physique soulage la mémoire de travail du stress de l'oubli.",
      "Faites une vidange mentale écrite dès que vous vous sentez submergés. Vous y verrez plus clair et planifierez vos actions avec recul."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Consulter constamment le pourcentage restant de sa batterie entretient une micro-anxiété liée à l'écoulement du temps et de la disponibilité.",
      "Désactivez l'affichage chiffré de l'énergie sur vos écrans personnels. Vous réduirez les rappels visuels stressants sans affecter vos usages."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Garder des dizaines d'onglets internet ouverts en permanence crée une charge visuelle qui dissipe l'attention à chaque coup d'œil.",
      "Fermez systématiquement les pages inutiles dès que vous changez de sujet d'étude. Vous simplifierez votre interface pour un focus de meilleure qualité."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Regrouper les tâches similaires au sein de blocs de temps dédiés supprime l'énergie perdue lors des changements de contexte mentaux.",
      "Traitez vos courriels ou vos appels téléphoniques en une seule fois plutôt que de couper vos élans. Vous maximiserez votre efficacité de travail."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une planification trop rigide génère de la frustration car elle interdit au cerveau de s'adapter aux imprévus inhérents à la vie courante.",
      "Laissez toujours un battement libre de 20% au sein de vos agendas quotidiens. Vous gérerez les urgences avec calme sans bousculer vos rituels."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Prendre le temps de valider ses réussites mineures libère de la dopamine, ce qui entretient la flamme de la motivation sur le long terme.",
      "Célébrez vos avancées concrètes en fin de semaine au lieu de regarder uniquement ce qu'il vous reste à faire. Vous renforcerez votre persévérance."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Visionner de brèves vidéos d'animaux mignons durant une pause recharge la vigilance et améliore la précision des tâches exécutées juste après.",
      "Ne culpabilisez pas si vous cherchez un moment de douceur visuelle en milieu de journée. Vous relancerez vos capacités cognitives de façon amusante."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La recherche absolue de perfection bloque le passage à l'action et génère une anxiété de performance néfaste pour notre santé mentale.",
      "Adoptez le principe du travail 'suffisamment bon' pour avancer de manière fluide. Vous préserverez votre sérénité tout en augmentant vos résultats.",
      "« La vie est trop courte pour être petite. »\n- Benjamin Disraeli"
    ]
  },

  // ==========================================
  // --- 8. HABITUDES DE VIE & RITUELS ---
  // ==========================================
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Instaurer un sas de déconnexion totale d'une heure avant le coucher permet au système nerveux de glisser doucement vers le mode de récupération.",
      "Éloignez-vous des flux d'actualités et des écrans en fin de soirée. Vous enverrez à votre corps un signal clair de préparation au calme."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Remplacer le parcours machinal de vos réseaux sociaux au réveil par cinq minutes de mouvements change la trajectoire de toute votre journée.",
      "Étirez-vous avant de poser les yeux sur vos messages matinaux. Vous prendrez les commandes de votre attention plutôt que de subir des stimuli extérieurs."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une douche tiède prise en fin de journée efface les tensions physiques en modifiant la perception thermique et nerveuse globale de l'organisme.",
      "Faites de ce passage sous l'eau un véritable rituel de nettoyage de vos soucis professionnels. Vous entrerez dans votre soirée l'esprit léger."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Se parler avec le niveau de bienveillance que l'on réserverait à son meilleur ami diminue drastiquement le risque d'épuisement émotionnel.",
      "Cessez d'utiliser un ton critique excessif envers vous-mêmes lors de vos erreurs. Vous musclerez votre estime personnelle et votre résilience.",
      "« Aimez-vous vous-même d'abord, et tout le reste s'alignera. »\n- Lucille Ball"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Tenir un journal intime écrit permet de mettre de l'ordre dans le tumulte des émotions et de prendre de la hauteur face aux événements.",
      "Consacrez quelques minutes chaque soir à coucher vos ressentis sur le papier. Vous digérerez vos journées et dormirez l'esprit apaisé.",
      "« Écrire dans un journal vous rappelle vos objectifs, vos aspirations et vos rêves. »\n- Deepak Chopra"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Préparer ses vêtements et ses affaires la veille au soir élimine la fatigue décisionnelle qui sature notre cerveau dès le réveil.",
      "Adoptez cette routine simple avant de vous coucher pour simplifier vos départs. Vous vous offrirez un début de matinée calme et sans précipitation."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Savourer sa boisson chaude matinale en pleine conscience constitue un excellent exercice d'ancrage sensoriel pour débuter la journée.",
      "Concentrez-vous sur la chaleur de votre tasse et sur les arômes sans allumer de moniteur. Vous habituerez votre esprit à être présent ici et maintenant.",
      "« La pleine conscience consiste à être présent dans tout ce que vous faites. »\n- Oprah Winfrey"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Une marche tranquille de dix minutes après le dîner soutient activement la digestion et aide à réguler la glycémie avant le repos nocturne.",
      "Prenez l'air un moment autour de chez vous après votre repas du soir. Vous faciliterez le travail de votre estomac et dormirez plus profondément."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Répéter le même enchaînement d'actions feutrées chaque soir conditionne le cerveau à libérer les hormones du sommeil de façon automatique.",
      "Mettez en place votre propre routine relaxante, entre lecture et lumières tamisées. Vous réduirez le temps nécessaire à votre endormissement.",
      "« Le moment présent est le seul moment disponible pour nous, et c'est la porte de tous les moments. »\n- Thich Nhat Hanh"
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Un bain de pieds tiède enrichi en sel d'Epsom transmet du magnésium à travers la peau, relaxant instantanément l'appareil musculaire fatigué.",
      "Offrez-vous ce soin relaxant après de longues heures passées debout en fin de semaine. Vous soulagerez la lourdeur de vos jambes à moindre coût."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Restreindre la consultation des informations d'actualité à une seule session par jour protège notre mental d'un état d'hypervigilance anxiogène.",
      "Fixez un moment précis pour vous informer sans laisser les alertes sonner en continu. Vous préserverez votre tranquillité d'esprit des chocs extérieurs."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Changer le visuel d'accueil de vos ordinateurs pour des paysages épurés brise la monotonie visuelle et diminue la fatigue oculaire.",
      "Sélectionnez des images inspirantes et changez-les à chaque début de mois. Vous rafraîchirez votre espace numérique de travail de façon agréable."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "La respiration nasale exclusive filtre mieux l'air inspiré et active les voies nerveuses responsables du ralentissement des fonctions d'alerte.",
      "Prenez conscience de votre façon de respirer lors de vos moments d'attente professionnels. Vous privilégierez le nez pour conserver votre calme."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "S'accorder une journée complète sans aucun écran une fois par mois réinitialise les capteurs de dopamine saturés par les stimulations digitales.",
      "Planifiez ce moment de détox numérique durant un week-end en pleine nature. Vous redécouvrirez le plaisir des plaisirs simples et du temps long."
    ]
  },
  {
    title: "Le saviez-vous ?",
    paragraphs: [
      "Le bien-être ne correspond pas à un idéal de perfection figé à atteindre mais à une succession de petits ajustements quotidiens menés avec douceur.",
      "Faites preuve de bienveillance envers vos imperfections tout au long de votre parcours. Vous avancerez un pas après l'autre vers votre équilibre.",
      "« Nourrissez votre esprit avec de grandes pensées car vous n'irez jamais plus haut que vous ne pensez. »\n- Benjamin Disraeli"
    ]
  },

  // ==========================================
  // --- CITATIONS DE FIN (DÉFIS & COURAGE) ---
  // ==========================================
  {
    title: "Citation du jour",
    paragraphs: [
      "« Faites chaque jour quelque chose qui vous fait peur. »",
      "- Eleanor Roosevelt"
    ]
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le courage c'est d'aller de l'avant malgré la peur, pas l'absence de peur. »",
      "- Ambrose Redmoon"
    ]
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« Le bonheur n'est pas un voyage, pas une destination. »",
      "- Ben Sweetland"
    ]
  },
  {
    title: "Citation du jour",
    paragraphs: [
      "« La joie est ce qui se passe quand nous permettons à nous-mêmes de reconnaître que tout va bien. »",
      "- Marianne Williamson"
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
