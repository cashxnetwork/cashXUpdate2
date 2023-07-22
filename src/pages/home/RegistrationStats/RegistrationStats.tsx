import React from 'react';
import { useGetRegistrationsStats } from '../../../hooks/ReferralHooks';
import { AiOutlineFire } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import { CiTimer } from 'react-icons/ci';
import { Heading, Icon, VStack, Wrap } from '@chakra-ui/react';
import { CenterComponent } from '../../../util/Ui';

export const RegistrationStats = () => {
  const registrationStats = useGetRegistrationsStats();
  const registrationValues = [
    {
      name: 'Total Registration Value',
      icon: AiOutlineFire,
    },
    {
      name: 'Referral Reward Distributed',
      icon: HiUserGroup,
    },
    {
      name: 'Weekly Reward Distributed',
      icon: CiTimer,
    },
  ];
  return (
    <VStack w="full" py={50}>
      <Wrap w="full" p={5} justify="center" align="center" spacing={10}>
        {registrationValues?.map((valuesObject, key) => {
          return (
            <CenterComponent
              key={key}
              style={{
                minW: [250, 300],
              }}
            >
              <VStack>
                <Icon as={valuesObject?.icon} boxSize={10}></Icon>
                <Heading>
                  {Number(
                    Number(registrationStats?.[key + 1]) / 10 ** 18
                  )?.toFixed(2)}{' '}
                  USDT
                </Heading>
                <Heading size="sm" w={150} textAlign="center">
                  {valuesObject?.name}
                </Heading>
              </VStack>
            </CenterComponent>
          );
        })}
      </Wrap>
    </VStack>
  );
};
