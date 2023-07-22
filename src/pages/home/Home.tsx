'use client';
import { VStack } from '@chakra-ui/react';
import { Header } from './Header';
import { PlanDiscriptionComponent } from './PlanDiscriptionComponent/PlanDiscriptionComponent';
import { PowerOfBlockchainComponent } from './PowerOfBlockchainComponent/PowerOfBlockchainComponent';
import { SupportedChainComponent } from './SupportedChainComponent';
import { TokenDistribution } from './TokenDistribution/TokenDistribution';
import WeeklyReward from './WeeklyReward/WeeklyReward';

export const Home = () => {
  return (
    <VStack w="full" minH={'100vh'} pt={20}>
      <Header />
      <SupportedChainComponent />
      <PlanDiscriptionComponent />
      {/* <TokenDistribution /> */}
      <PowerOfBlockchainComponent />
      <WeeklyReward />
    </VStack>
  );
};
