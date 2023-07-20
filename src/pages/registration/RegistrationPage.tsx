import { useParams } from 'react-router-dom';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import ReactSlickRegistration from './ReactSlickRegistration';
import {
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useNativePrice,
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
  const nativePrice = useNativePrice();

  return (
    <VStack spacing={10} py={100} minH={'100vh'}>
      <VStack>
        <HStack>
          <Icon as={FcGoodDecision} boxSize={10}></Icon>
          <Heading color="orange.500">
            {userBusiness.selfBusiness === 0 ? 'Register' : 'Upgrade'}
          </Heading>
        </HStack>
        <Divider />
      </VStack>
      {userBusiness.selfBusiness === 0 ? (
        <RegistrationUI referrerAddress={referrerAddress}></RegistrationUI>
      ) : (
        <UpgradeUI
          upgradePlan={upgradePlans?.upgradePlans[userLevelToUpgrade]}
          valueInDecimals={
            Number(
              upgradePlans?.upgradePlans[userLevelToUpgrade]
                .valueToUpgradeInUSD ?? 0
            ) / Number(nativePrice)
          }
        ></UpgradeUI>
      )}
      ;
    </VStack>
  );
}
