import { Divider, HStack, Heading, Icon, VStack } from '@chakra-ui/react';
import { FcGoodDecision } from 'react-icons/fc';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import UpgradeUI from '../../components/UpgradeUi/UpgradeUi';
import {
  useGetUpgradePlanById,
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useNativePrice,
  useUpgradePlans,
} from '../../hooks/ReferralHooks';

export default function RegistrationPage() {
  const { address } = useAccount();
  const { referrerAddress } = useParams();
  const userBusiness = useGetUserBusiness(address);
  const userLevelToUpgrade = useGetUserLevelToUpgrade(address);
  const nativePrice = useNativePrice();
  const planById = useGetUpgradePlanById(userLevelToUpgrade);
  
  console.log(nativePrice);
  
  const upgradePlans = useUpgradePlans();
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
        <RegistrationUI
          referrerAddress={referrerAddress}
          valueInDecimals={
            Number(
              upgradePlans?.upgradePlans[userLevelToUpgrade]
                .valueToUpgradeInUSD ?? 0
            ) / Number(nativePrice)
          }
        ></RegistrationUI>
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
