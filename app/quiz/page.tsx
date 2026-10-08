import type { Metadata } from 'next';
import QuizFlow from '@/components/QuizFlow';

export const metadata: Metadata = {
  title: 'Find the Right Water System | US Water Pros',
  description: 'Answer a few quick questions and get a water system recommendation for your Washington home.',
};

export default function QuizPage() { return <main><QuizFlow /></main>; }
