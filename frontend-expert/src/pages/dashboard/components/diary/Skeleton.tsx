import React from 'react';
import Skeleton from 'components/Skeleton';

function DiarySkeletonLog() {
  return (
    <div className="d-flex my-4">
      <Skeleton.Avatar />
      <div className="w-75 ms-3 d-flex flex-column gap-2 ">
        <div className="w-25">
          <Skeleton.Text />
        </div>
        <Skeleton.Text />
        <Skeleton.Text />
      </div>
    </div>
  );
}

function DiarySkeleton() {
  return (
    <>
      <div className="border-bottom mb-4 py-2">
        <Skeleton.Title className="mb-3" />
        <Skeleton.Title className="mb-2" />
      </div>
      <Skeleton
        backgroundColor="#f8f9fa"
        className="p-4 d-flex flex-column gap-2"
      >
        <Skeleton.Title className="mb-2" />
        <Skeleton.Text />
        <Skeleton.Text />
      </Skeleton>

      <>{Array(6).fill(<DiarySkeletonLog />)}</>
    </>
  );
}

export default DiarySkeleton;
