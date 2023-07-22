'use client';
import { HStack, Heading, Icon, VStack, Wrap } from '@chakra-ui/react';
import { AiOutlineFire } from 'react-icons/ai';
import { CiTimer } from 'react-icons/ci';
import { HiUserGroup } from 'react-icons/hi';
import { SlGlobeAlt } from 'react-icons/sl';
import { Counter } from '../../../components/Counter';
import {
  useGetRegistrationsStats,
  useGetWeeklyRewardToBeDistributed,
} from '../../../hooks/ReferralHooks';
import { CenterComponent, HeadingComponent } from '../../../util/Ui';

function WeeklyReward() {
  const weeklyRewardsToBeDistributed = useGetWeeklyRewardToBeDistributed();
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
    <VStack w="full" py={10} spacing={10}>
      <HeadingComponent
        heading="Weekly Rewards to be"
        gradientHeading="DISTRIBUTED"
      ></HeadingComponent>
      <VStack>
        <HStack>
          <Heading>
            {Number(
              Number(weeklyRewardsToBeDistributed?.[0]) / 10 ** 18
            )?.toFixed(2)}
          </Heading>
          <Heading color="orange.500">USDT</Heading>
        </HStack>
      </VStack>
      <VStack>
        <Heading>Remaining Time</Heading>
        <Counter
          timeinseconds={Number(weeklyRewardsToBeDistributed?.[2])}
        ></Counter>
      </VStack>
    </VStack>
  );
}

export default WeeklyReward;
