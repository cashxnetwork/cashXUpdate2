'use client';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  HStack,
  Heading,
  Icon,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Tag,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { shortenAddress } from '@usedapp/core';
import { useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { parseEther } from 'viem';
import { useAccount, useBalance, useContractWrite, useNetwork } from 'wagmi';
import { BNBLogoSVG } from '../../assets';
import { AddressZero } from '../../constants/ContractAddress';
import { supportedNetworkInfo } from '../../constants/SupportedNetworkInfo';
import {
  UpgradePlanInfoValueType,
  useGetUserTeam,
} from '../../hooks/ReferralHooks';
import { CenterComponent } from '../../util/Ui';
import { isAddressValid } from '../../util/UtilHooks';
import ModalConfirmTransactions from '../Modals/ModalConfirmTransactions';
import ModalTransactionSuccess from '../Modals/ModalTransactionSuccess';

function UpgradeUI({
  upgradePlan,
  valueInDecimals,
}: {
  upgradePlan: UpgradePlanInfoValueType;
  valueInDecimals: number;
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const minBuyingValue = 0.1;
  const userTeamObject = useGetUserTeam(address);
  const currentNetwork = supportedNetworkInfo[chain?.id!];

  const userNativeBalance = useBalance({
    address: address,
  });

  const cardBackgroundColor = useColorModeValue('green.50', 'gray.900');

  const {
    data,
    isLoading,
    isSuccess,
    write,
    status,
    reset,
    writeAsync,
    error: writeContractHookError,
    isError,
    isIdle,
  } = useContractWrite({
    address: currentNetwork?.referralContractAddress,
    abi: currentNetwork?.referralContractInterface,
    functionName: 'upgradeAccountNative',
    value: parseEther(`${valueInDecimals}`),
  });

  const errors = {
    isUserHaveSufficientTokenBalance:
      Number(userNativeBalance?.data?.formatted ?? 0) >= valueInDecimals
        ? true
        : false,
  };

  const proceedTransaction = () => {
    if (!errors.isUserHaveSufficientTokenBalance) {
      toast({
        title: 'Insufficient Balance.',
        description: 'You dont have enough USDT to register.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      onOpen();
    }
  };

  const handleTransaction = async () => {
    try {
      await writeAsync();
      if (status === 'success') {
        toast({
          title: 'Transaction Success',
          description: '',
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
        setTimeout(() => {
          reset();
          onClose();
        }, 20000);
      }
    } catch (err: any) {
      toast({
        title: err.message,
        description: '',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {}, [isSuccess, toast, onClose, reset]);

  return (
    <VStack spacing={10}>
      <CenterComponent
        style={{
          py: 10,
          w: [300],
        }}
      >
        <VStack minW={250} maxW={300} w="full" spacing={5}>
          <Heading textAlign="center" color="twitter.500">
            Level #{upgradePlan?.id}
          </Heading>
          <HStack>
            <Heading textAlign="center" color="twitter.500" fontSize="7xl">
              ${Number(upgradePlan?.valueToUpgradeInUSD) / 10 ** 18}
            </Heading>
          </HStack>
          <Heading size="sm">You have to pay</Heading>
          <Tag py={5} px={10} borderRadius="3xl" colorScheme="yellow">
            <HStack fontStyle="italic">
              <Heading size="md">{valueInDecimals?.toFixed(5)}</Heading>
              <Heading fontWeight={500} size="md">
                BNB
              </Heading>
            </HStack>
          </Tag>
          <Divider></Divider>
          <Tag p={3} borderRadius="3xl" w="full">
            <HStack w="full">
              <Stack>
                <Text>Your Balance</Text>
                <Heading size="md" fontStyle="italic">
                  {Number(userNativeBalance?.data?.formatted)?.toFixed(2)} BNB
                </Heading>
              </Stack>
              <Spacer />
              <Image src={BNBLogoSVG} alt="BNB Logo" boxSize={14}></Image>
            </HStack>
          </Tag>

          <Button
            borderRadius="3xl"
            rightIcon={<ChevronRightIcon />}
            colorScheme="twitter"
            bgColor="twitter.500"
            _hover={{
              bgColor: 'twitter.400',
            }}
            onClick={proceedTransaction}
            isDisabled={isLoading}
            w="full"
            h={20}
          >
            Upgrade Now
          </Button>
        </VStack>
      </CenterComponent>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        size={['xs', 'md', 'lg']}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="25px"
          // bgColor={useColorModeValue('whiteAlpha.900', 'blackAlpha.200')}
          backdropFilter="blur(20px)"
          borderWidth={1}
          borderBottomWidth={5}
        >
          <ModalCloseButton />
          {!isSuccess ? (
            <ModalConfirmTransactions
              onClose={onClose}
              onConfirm={handleTransaction}
              transactionName="Upgrade"
              outCurrencyObject={{
                logo: BNBLogoSVG,
                symbol: 'BNB',
              }}
              outCurrencyValue={minBuyingValue}
              buttonProps={{
                isLoading: isLoading,
                isDisabled: isLoading,
                loadingText: 'Confirming',
              }}
            ></ModalConfirmTransactions>
          ) : (
            <ModalTransactionSuccess
              onClose={() => {
                onClose();
                reset();
              }}
              transactionHash={`${data?.hash}`}
              currentNetwork={currentNetwork}
            ></ModalTransactionSuccess>
          )}
        </ModalContent>
      </Modal>
    </VStack>
  );
}

export default UpgradeUI;
