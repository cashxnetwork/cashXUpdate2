'use client';
import { HStack, Heading, VStack } from '@chakra-ui/react';
import { useNetwork } from 'wagmi';
import { Counter } from '../../../components/Counter';
import { supportedNetworkInfo } from '../../../constants/SupportedNetworkInfo';
import {
  useGetWeeklyRewardToBeDistributed,
  useNativePrice
} from '../../../hooks/ReferralHooks';
import { PageWrapper } from '../../../util/PageWrapper';
import { HeadingComponent } from '../../../util/Ui';

function WeeklyReward() {
  const weeklyRewardsToBeDistributed = useGetWeeklyRewardToBeDistributed();
  const useCurrentNetwork = supportedNetworkInfo[56];
  const nativePrice = useNativePrice(useCurrentNetwork?.priceOracleAddress!);

  return (
    <PageWrapper>
      <HeadingComponent
        heading="Weekly Rewards to be"
        gradientHeading="DISTRIBUTED"
      ></HeadingComponent>
      <VStack>
        <HStack>
          <Heading>
            {Number(
              (Number(weeklyRewardsToBeDistributed?.[0]) / 10 ** 18) * (Number(nativePrice ?? 0) / 10 ** 18)
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
    </PageWrapper>
  );
}

export default WeeklyReward;
