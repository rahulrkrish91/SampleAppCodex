import React from 'react';

export default function M3Card({ children, className = '' }) {
  return (
    <section className={`rounded-m3 bg-m3Surface p-5 shadow-m3 ring-1 ring-m3SurfaceTint ${className}`}>
      {children}
    </section>
  );
}
