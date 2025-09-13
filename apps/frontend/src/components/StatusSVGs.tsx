import React from 'react';

interface StatusSVGProps {
  className?: string;
}

export const ActiveStatusSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#10B981" stroke="#059669" strokeWidth="2"/>
    <path d="9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const InactiveStatusSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
    <path d="15 9l-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PendingStatusSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="#F59E0B" stroke="#D97706" strokeWidth="2"/>
    <path d="12 6v6l4 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const LowStockSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
    <path d="M12 9v4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 17h.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GoodStockSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M9 11l3 3 8-8" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c1.5 0 2.91.37 4.15 1.02" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const ArchivedStatusSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="#6B7280" stroke="#4B5563" strokeWidth="2"/>
    <path d="M16 8v8H8V8" fill="#374151"/>
    <path d="M8 4V2a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#4B5563" strokeWidth="2" fill="none"/>
  </svg>
);

export const MedicalTypeSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-9-5z" fill="#3B82F6" stroke="#2563EB" strokeWidth="2"/>
    <path d="M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const DentalTypeSVG: React.FC<StatusSVGProps> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M12 2c3 0 6 2 6 6v8c0 3-2 4-3 4s-2-1-2-3v-4c0-1-.5-2-1-2s-1 1-1 2v4c0 2-1 3-2 3s-3-1-3-4V8c0-4 3-6 6-6z" fill="#10B981" stroke="#059669" strokeWidth="2"/>
    <circle cx="9" cy="10" r="1" fill="white"/>
    <circle cx="15" cy="10" r="1" fill="white"/>
  </svg>
);

export const getStatusSVG = (status: string, className?: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'available':
      return <ActiveStatusSVG className={className} />;
    case 'inactive':
    case 'unavailable':
      return <InactiveStatusSVG className={className} />;
    case 'pending':
      return <PendingStatusSVG className={className} />;
    case 'archived':
      return <ArchivedStatusSVG className={className} />;
    case 'low':
    case 'low_stock':
      return <LowStockSVG className={className} />;
    case 'good':
    case 'good_stock':
      return <GoodStockSVG className={className} />;
    case 'medical':
      return <MedicalTypeSVG className={className} />;
    case 'dental':
      return <DentalTypeSVG className={className} />;
    default:
      return <ActiveStatusSVG className={className} />;
  }
};