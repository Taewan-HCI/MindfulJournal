/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentType, ReactElement } from 'react';
import { Spinner } from 'react-bootstrap';

interface WithLoadingProps {
  isLoading: boolean;
  children: ReactElement;
}

/**
 * loading 상태에 따라 spinner + 'Loading' text로 구성된 children을 리턴해주는 HOC
 * @param Component isLoading, children을 가지는 Component를 param으로 전달
 */
function WithLoading<P extends object>(
  Component: ComponentType<P>,
): React.FC<P & WithLoadingProps> {
  return function WihLoadingComponent({
    children,
    isLoading,
    ...props
  }: WithLoadingProps) {
    return (
      <Component {...(props as P)}>
        {isLoading ? (
          <>
            <Spinner animation="border" variant="light" size="sm" />
            <span> Loading </span>
          </>
        ) : (
          children
        )}
      </Component>
    );
  };
}

export default WithLoading;
