/* eslint-disable react/destructuring-assignment */
import React, { ReactNode } from 'react';
import './Skeleton.css';

interface SkeletionProps {
  children: ReactNode;
  backgroundColor: string;
}

function Skeleton(props: SkeletionProps) {
  return (
    <div
      style={{
        backgroundColor: `${props.backgroundColor}`,
        borderRadius: '10px',
      }}
      className="p-4"
    >
      {props.children}
    </div>
  );
}

function Avatar() {
  return <div className="skeleton-item avatar element" />;
}

function Title() {
  return <div className="skeleton-item element title" />;
}

function Text() {
  return <div className="skeleton-item element text" />;
}

Skeleton.Avatar = Avatar;
Skeleton.Title = Title;
Skeleton.Text = Text;

export default Skeleton;
