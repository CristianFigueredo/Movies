import React, { PropsWithChildren, useState, useEffect } from 'react'

type AwaitProps = PropsWithChildren<{
  for: boolean
  fallback: React.ReactNode
}>

/**
 * A component that renders its children only when a condition is met.
 */
const Await: React.FC<AwaitProps> = ({ for: condition, fallback, children }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (condition) {
      setShouldRender(true);
    }
  }, [condition]);

  return shouldRender ? <>{children}</> : <>{fallback}</>;
};

export default Await;
