'use client';

import { useMediaQuery } from "@uidotdev/usehooks";

export const ClientRoot = ({
  mobileComponent,
  desktopComponent,
}: {
  mobileComponent: JSX.Element | JSX.Element[];
  desktopComponent: JSX.Element | JSX.Element[];
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? mobileComponent : desktopComponent;
};
export default ClientRoot;
