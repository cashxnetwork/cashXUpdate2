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

  console.log(registrationStats);

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
    <VStack w="full" minH="80vh" py={10} spacing={10}>
      {/* <Heading>Weekly Reward to be distribued</Heading> */}
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

        {/* <Button size="lg" borderRadius="xl">
          Distribute Reward
        </Button> */}
      </VStack>
      <VStack>
        <Heading>Remaining Time</Heading>
        <Counter
          timeinseconds={Number(weeklyRewardsToBeDistributed?.[2])}
        ></Counter>
      </VStack>
      <Wrap w="full" p={5} justify="center" align="center" spacing={10}>
        {registrationValues?.map((valuesObject, key) => {
          return (
            <CenterComponent
              key={key}
              style={{
                minW: 300,
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
}

export default WeeklyReward;
