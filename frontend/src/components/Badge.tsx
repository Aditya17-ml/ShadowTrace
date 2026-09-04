import React from 'react';

export function Badge({ t }: { t: string }) {
  const type = t ? t.toLowerCase() : 'low';
  return <span className={`badge ${type}`}>{t}</span>;
}
