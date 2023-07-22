import { Divider, HStack, Heading, Icon, VStack } from '@chakra-ui/react';
import { FcGoodDecision } from 'react-icons/fc';
import { useParams } from 'react-router-dom';
import { useAccount, useNetwork } from 'wagmi';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import UpgradeUI from '../../components/UpgradeUi/UpgradeUi';
import { supportedNetworkInfo } from '../../constants/SupportedNetworkInfo';
import {
  useGetUserBusiness,
  useGetUserLevelToUpgrade,
  useNativePrice,
  useNeedNativeToRegister,
  useUpgradePlans,
} from '../../hooks/ReferralHooks';
import { CheckReferrerActive } from './CheckReferrerActive';

export default function RegistrationPage() {
  const { chain } = useNetwork();
  const currentNetwork = supportedNetworkInfo[chain?.id!];
  const { address } = useAccount();
  const { referrerAddress } = useParams<{ referrerAddress: `0x${string}` }>();
  const userBusiness = useGetUserBusiness(address);
  const userLevelToUpgrade = useGetUserLevelToUpgrade(address);
  const nativePrice = useNativePrice(currentNetwork?.priceOracleAddress!);
  const upgradePlans = useUpgradePlans();
  const valueToRegister = useNeedNativeToRegister(
    currentNetwork.priceOracleAddress!
  );

  return (
    <CheckReferrerActive check={userBusiness?.selfBusiness > 0 ? false : true}>
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
            valueInDecimals={Number(valueToRegister ?? 0) / 10 ** 18}
            currentNetwork={currentNetwork}
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
            currentNetwork={currentNetwork}
          ></UpgradeUI>
        )}
        ;
      </VStack>
    </CheckReferrerActive>
  );
}
