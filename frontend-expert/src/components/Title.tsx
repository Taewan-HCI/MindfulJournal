import React from 'react';

interface TitleProps {
  children?: React.ReactNode;
  title: string;
}

const defaultProps = {
  children: null,
};

function Title({ title, children }: TitleProps) {
  return (
    <p className="fs-5 fw-bold text-primary">
      <span>{title}</span>
      {children}
    </p>
  );
}
Title.defaultProps = defaultProps;

export default Title;
