import {
  Divider,
  HStack,
  Heading,
  Icon,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FcBrokenLink, FcGoodDecision } from 'react-icons/fc';
import { useParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import UpgradeUI from '../../components/UpgradeUi/UpgradeUi';
import {
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useNativePrice,
  useUpgradePlans,
} from '../../hooks/ReferralHooks';
import SocialMediaIcons from '../../components/SocialMediaIcons';

export default function RegistrationPage() {
  const { address } = useAccount();
  const { referrerAddress } = useParams();
  const userBusiness = useGetUserBusiness(address);
  const userLevelToUpgrade = useGetUserLevelToUpgrade(address);
  const nativePrice = useNativePrice();
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
        !referrerAddress ? (
          <VStack justify="center" spacing={5}>
            <Icon as={FcBrokenLink} boxSize={40}></Icon>
            <VStack>
              <Heading color="red" textAlign="center">
                You need referral link to register.
              </Heading>
              <Text>You may get it from our social links below</Text>
            </VStack>
            <SocialMediaIcons
              style={{
                boxSize: 14,
                'aria-label': 'Icon Buttons',
                variant: 'outline',
              }}
            ></SocialMediaIcons>
          </VStack>
        ) : (
          <RegistrationUI
            referrerAddress={referrerAddress}
            valueInDecimals={
              Number(
                upgradePlans?.upgradePlans[userLevelToUpgrade]
                  .valueToUpgradeInUSD ?? 0
              ) / Number(nativePrice)
            }
          ></RegistrationUI>
        )
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
