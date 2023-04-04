import React from 'react';

function ContentWithTitle({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4">
      <p className="fs-5 fw-bold text-primary">{title}</p>
      {children}
    </div>
  );
}

export default ContentWithTitle;
