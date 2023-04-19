/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Overlay } from 'react-bootstrap';

type DisplayTooltipType = {
  target: React.MutableRefObject<HTMLDivElement | null>;
  show: boolean;
  countedNum: number;
};

function DisplayTooltip({ target, show, countedNum }: DisplayTooltipType) {
  return (
    <Overlay target={target.current} show={show} placement="top">
      {({
        placement: _placement,
        arrowProps: _arrowProps,
        show: _show,
        popper: _popper,
        hasDoneInitialMeasure: _hasDoneInitialMeasure,
        ...props
      }) => (
        <div
          {...props}
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '2px 10px',
            color: 'white',
            borderRadius: 3,
            // eslint-disable-next-line react/prop-types
            ...props.style,
          }}
        >
          {target.current ? target.current.innerHTML : ''}({countedNum})
        </div>
      )}
    </Overlay>
  );
}

export default React.memo(DisplayTooltip);
