import React from 'react';

interface RowWithTitleProps {
  children: React.ReactNode;
  title: string;
}

function RowWithTitle({ children, title }: RowWithTitleProps) {
  return (
    <div className="d-flex align-items-center justify-content-between py-2">
      <div className="text-secondary">{title}</div>
      {children}
    </div>
  );
}

export default RowWithTitle;
