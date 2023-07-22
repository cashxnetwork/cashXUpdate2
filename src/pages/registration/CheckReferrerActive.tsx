import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { isAddressValid } from '../../util/UtilHooks';
import { RegistrationErrorPage } from './RegistrationErrorPage';
import { VStack } from '@chakra-ui/react';
import { CheckIfReferrerAddressValid } from './CheckIfReferrerAddressValid';
import { useGetUserBusiness } from '../../hooks/ReferralHooks';

export const CheckReferrerActive = ({ children }: { children: ReactNode }) => {
  const { referrerAddress } = useParams<{ referrerAddress: `0x${string}` }>();
  const referrerBusiness = useGetUserBusiness(referrerAddress);

  return (
    <CheckIfReferrerAddressValid>
      {referrerBusiness?.selfBusiness > 0 ? (
        children
      ) : (
        <RegistrationErrorPage errorReason="Referrer is not active."></RegistrationErrorPage>
      )}
    </CheckIfReferrerAddressValid>
  );
};
