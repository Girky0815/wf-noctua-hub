import React from 'react';

type SectionTitleProps = {
  title: string;
  trailing?: React.ReactNode;
  className?: string;
};

export const SectionTitle: React.FC<SectionTitleProps> = ({ title, trailing, className = '' }) => (
  <div className={`mb-2 ml-4 flex items-center gap-3 ${className}`}>
    <h3
      className="text-sm font-bold text-primary font-display"
      style={{ fontVariationSettings: "'ROND' 100" }}
    >
      {title}
    </h3>
    {trailing}
  </div>
);
