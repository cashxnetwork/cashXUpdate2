import { useParams } from 'react-router-dom';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import ReactSlickRegistration from './ReactSlickRegistration';
import {
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useUpgradePlans,
} from '../../hooks/ReferralHooks';
import { useAccount } from 'wagmi';
import { Divider, HStack, Heading, Icon, VStack } from '@chakra-ui/react';
import { FcGoodDecision } from 'react-icons/fc';
import UpgradeUI from '../../components/UpgradeUi/UpgradeUi';

export default function RegistrationPage() {
  const { address } = useAccount();
  const { referrerAddress } = useParams();
  const upgradePlans = useUpgradePlans();
  const userBusiness = useGetUserBusiness(address);
  const userLevelToUpgrade = useGetUserLevelToUpgrade(address);

  console.log(userLevelToUpgrade);

  return userBusiness.selfBusiness === 0 ? (
    <VStack spacing={10}>
      <VStack>
        <HStack>
          <Icon as={FcGoodDecision} boxSize={10}></Icon>
          <Heading color="orange.500">Register</Heading>
        </HStack>
        <Divider />
      </VStack>
      <RegistrationUI referrerAddress={referrerAddress}></RegistrationUI>
    </VStack>
  ) : (
    <VStack spacing={10}>
      <VStack>
        <HStack>
          <Icon as={FcGoodDecision} boxSize={10}></Icon>
          <Heading color="orange.500">Upgrade</Heading>
        </HStack>
        <Divider />
      </VStack>
      <UpgradeUI
        upgradePlan={upgradePlans?.upgradePlans[userLevelToUpgrade]}
        valueInDecimals={0.1}
      ></UpgradeUI>
    </VStack>
  );
}
