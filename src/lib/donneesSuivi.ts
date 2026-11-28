import prisma from "@/lib/prisma";

// Effacement des données de suivi d'une utilisatrice (rubrique « Mes données » de /dashboard/profile).
// Le compte, l'abonnement, les achats et le coaching ne sont jamais touchés ici.
//
// - cycle  : profil menstruel (situation, durées, mode discret), historique des règles,
//            réglages des jours (retard, notes, tests, rapports) et synthèses quotidiennes (symptômes, ressentis)
// - carnet : humeurs, ressentis, journal, notes rapides, habitudes, défis et loisirs
export async function effacerDonneesSuivi(userId: number, { cycle, carnet }: { cycle: boolean; carnet: boolean }) {
  const operations = [];
  if (cycle) {
    operations.push(
      prisma.menstrualProfile.deleteMany({ where: { userId } }),
      prisma.periodHistory.deleteMany({ where: { userId } }),
      prisma.cycleDay.deleteMany({ where: { userId } }),
      prisma.symptomLog.deleteMany({ where: { userId } })
    );
  }
  if (carnet) {
    operations.push(
      prisma.moodEntry.deleteMany({ where: { userId } }),
      prisma.dailyFeeling.deleteMany({ where: { userId } }),
      prisma.journalNote.deleteMany({ where: { userId } }),
      prisma.quickNote.deleteMany({ where: { userId } }),
      prisma.habitCheck.deleteMany({ where: { userId } }),
      prisma.challengeItem.deleteMany({ where: { userId } }),
      prisma.hobbyCategory.deleteMany({ where: { userId } }),
      // Défis et loisirs repartent de la liste proposée par défaut, comme pour une nouvelle inscription
      prisma.user.update({ where: { id: userId }, data: { challengesSeeded: false, hobbiesSeeded: false } })
    );
  }
  // Tout ou rien : une erreur au milieu n'efface rien
  await prisma.$transaction(operations);
}
