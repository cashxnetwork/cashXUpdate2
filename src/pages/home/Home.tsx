'use client';
import { VStack } from '@chakra-ui/react';
import { Header } from './Header';
import { PlanDiscriptionComponent } from './PlanDiscriptionComponent/PlanDiscriptionComponent';
import { PowerOfBlockchainComponent } from './PowerOfBlockchainComponent/PowerOfBlockchainComponent';
import { SupportedChainComponent } from './SupportedChainComponent';
import { TokenDistribution } from './TokenDistribution/TokenDistribution';
import WeeklyReward from './WeeklyReward/WeeklyReward';
import { RegistrationStats } from './RegistrationStats/RegistrationStats';
import { AboutUs } from './AboutUs/AboutUs';
import { Tokenomics } from './Tokenomics/Tokenomics';
import { Roadmap } from './Roadmap/Roadmap';
import { Features } from './Features/Features';

export const Home = () => {
  return (
    <VStack w="full" minH={'100vh'} pt={20}>
      <Header />
      <RegistrationStats />
      <WeeklyReward />
      <SupportedChainComponent />
      <PlanDiscriptionComponent />
      <AboutUs />
      <Features/>
      <Tokenomics />
      <Roadmap />
      {/* <TokenDistribution /> */}
      <PowerOfBlockchainComponent />
    </VStack>
  );
};
