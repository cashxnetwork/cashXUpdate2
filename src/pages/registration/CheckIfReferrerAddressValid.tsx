import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { isAddressValid } from '../../util/UtilHooks';
import { RegistrationErrorPage } from './RegistrationErrorPage';
import { VStack } from '@chakra-ui/react';

export const CheckIfReferrerAddressValid = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { referrerAddress } = useParams();
  return (
    <VStack w="full">
      {referrerAddress ? (
        isAddressValid(referrerAddress) ? (
          children
        ) : (
          <RegistrationErrorPage errorReason="Referrer address wrong. Please check it again"></RegistrationErrorPage>
        )
      ) : (
        <RegistrationErrorPage errorReason="You need referrer address to register."></RegistrationErrorPage>
      )}
    </VStack>
  );
};
