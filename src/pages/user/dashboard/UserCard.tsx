import { Divider, Heading } from '@chakra-ui/react';
import React from 'react';
import { CardContainer } from '../../../components/CardContainer';
import { RiUser6Fill } from 'react-icons/ri';
import { useGetUserRewards } from '../../../hooks/ReferralHooks';

export const UserCard = ({ userAddress }: { userAddress: `0x${string}` }) => {
  const userRewards = useGetUserRewards(userAddress);
  return (
    <CardContainer heading="Hey Welcome!" icon={RiUser6Fill}>
      <Heading textAlign="center">You have earned</Heading>
      <Heading fontSize="5xl" color="twitter.500">
        ${userRewards?.allRewards}
      </Heading>
      {/* <Divider></Divider> */}
    </CardContainer>
  );
};
