import React from 'react';
import type { BatchStatus, ReturnStatus, TrustGateDecision } from '../../types/medtrace';

interface BadgeProps {
  status: BatchStatus | ReturnStatus | TrustGateDecision | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    case 'ACTIVE':
    case 'ALLOW':
    case 'VERIFIED':
    case 'COMPLETED':
      styleClasses = 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
      break;

    case 'EXPIRING_SOON':
    case 'WARNING':
    case 'REQUESTED':
    case 'PENDING':
      styleClasses = 'bg-amber-950/80 text-amber-300 border-amber-800/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
      break;

    case 'EXPIRED':
    case 'INVESTIGATE':
    case 'RETURN_REQUESTED':
    case 'DISTRIBUTOR_RECEIVED':
      styleClasses = 'bg-sky-950/80 text-sky-300 border-sky-800/60 shadow-[0_0_12px_rgba(14,165,233,0.15)]';
      break;

    case 'MANUFACTURER_RECEIVED':
    case 'PENDING_DESTRUCTION':
      styleClasses = 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60 shadow-[0_0_12px_rgba(99,102,241,0.15)]';
      break;

    case 'DESTROYED':
      styleClasses = 'bg-purple-950/80 text-purple-300 border-purple-800/60 shadow-[0_0_12px_rgba(168,85,247,0.15)]';
      break;

    case 'DISPUTED':
    case 'BLOCK':
    case 'FRAUD_ALERT':
    case 'MISMATCH':
    case 'REJECTED':
      styleClasses = 'bg-rose-950/80 text-rose-300 border-rose-800/60 shadow-[0_0_12px_rgba(244,63,94,0.2)] animate-pulse';
      break;

    default:
      styleClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border ${styleClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-ping opacity-75"></span>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
