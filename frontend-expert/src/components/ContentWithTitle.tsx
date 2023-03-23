import React from 'react';

function ContentWithTitle({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <>
      <p className="fs-5 fw-bold text-primary">{title}</p>
      {children}
    </>
  );
}

export default ContentWithTitle;
