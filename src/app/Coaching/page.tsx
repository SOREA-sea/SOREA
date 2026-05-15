import { Suspense } from 'react';
import CoachingPage from '@/components/Coaching';

export default function CoachingRoute() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CoachingPage />
    </Suspense>
  );
}
