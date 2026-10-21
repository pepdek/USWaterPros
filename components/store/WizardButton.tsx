'use client';
import { openWizard } from './openWizard';
import { STORE } from '@/lib/store';

export default function WizardButton({ children = STORE.cta, className = 'btn btn-cta', tier, onClick }: { children?: React.ReactNode; className?: string; tier?: string; onClick?: () => void }) {
  return <button type="button" className={className} onClick={(e) => { onClick?.(); openWizard({ tier }, e.currentTarget); }}>{children}</button>;
}
