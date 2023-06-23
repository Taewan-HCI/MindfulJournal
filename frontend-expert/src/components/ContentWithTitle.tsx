import React from 'react';
import Title from './Title';

interface ContentWithTitleProps {
  children: React.ReactNode;
  title: string;
}

function ContentWithTitle({ children, title }: ContentWithTitleProps) {
  return (
    <div className="mb-4">
      <Title title={title} />
      {children}
    </div>
  );
}

export default ContentWithTitle;
