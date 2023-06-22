import React from 'react';
import './SortTab.css';

export const SORT_ORDER = {
  newest: true,
  oldest: false,
};

interface SortTabProps {
  onClick: (v: boolean) => void;
  sortOrder: boolean;
}
/**
 * 최신순, 오래된순으로 정렬하는 탭이다.
 */
function SortTab({ onClick, sortOrder }: SortTabProps) {
  const ACTIVE = 'active';
  const INACTIVE = '';
  return (
    <ul className="sort-option">
      <li
        className={`sort-option ${
          sortOrder === SORT_ORDER.newest ? ACTIVE : INACTIVE
        }`}
        onClick={() => onClick(SORT_ORDER.newest)}
        role="presentation"
      >
        최신순
      </li>
      <li
        className={`sort-option ${
          sortOrder === SORT_ORDER.oldest ? ACTIVE : INACTIVE
        }`}
        onClick={() => onClick(SORT_ORDER.oldest)}
        role="presentation"
      >
        오래된순
      </li>
    </ul>
  );
}

export default SortTab;
