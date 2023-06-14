/* eslint-disable react/require-default-props */
/* eslint-disable react/destructuring-assignment */
import React, { ReactNode } from 'react';
import './Skeleton.css';

interface SkeletionProps extends ClassNameProps {
  children: ReactNode;
  backgroundColor: string;
}

interface ClassNameProps {
  className?: string;
}

const defaultProps = {
  className: '',
};

function Skeleton({ children, backgroundColor, className }: SkeletionProps) {
  return (
    <div
      style={{
        backgroundColor: `${backgroundColor}`,
        borderRadius: '10px',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

function Avatar() {
  return <div className="skeleton-item avatar element" />;
}

function Title({ className }: ClassNameProps) {
  return <div className={`skeleton-item element title ${className}`} />;
}

function Text() {
  return <div className="skeleton-item element text" />;
}

Skeleton.Avatar = Avatar;
Skeleton.Title = Title;
Skeleton.Text = Text;

Skeleton.defaultProps = defaultProps;

export default Skeleton;
