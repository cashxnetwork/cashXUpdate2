import {
  HStack,
  Heading,
  Image,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { BUSDLogoSVG, USDTLogoSVG } from '../../assets';
import { CenterComponent, HeadingComponent } from '../../util/Ui';

export const SupportedChainComponent = () => {
  const supprtedChains = [
    {
      name: 'Binance Smart Chain',
      logo: '/token-icons/bnb.svg',
    },
  ];

  const supportedCurrency = [
    {
      name: 'BNB',
      logo: '/token-icons/bnb.svg',
    },
  ];
  return (
    <VStack py={50} spacing={5} w="full">
      <HeadingComponent
        heading="Supported by the"
        gradientHeading="BEST"
      ></HeadingComponent>
      <HStack spacing={[2, 5, 10]} p={[2, 5, 10]}>
        {supprtedChains?.map((chainObject, key) => {
          return (
            <CenterComponent
              key={key}
              style={{
                px: 10,
              }}
            >
              <VStack>
                <Image
                  src={chainObject?.logo}
                  alt={chainObject?.name}
                  width={50}
                  height={50}
                ></Image>
                50
              </VStack>
            </CenterComponent>
          );
        })}
      </HStack>
      <HeadingComponent
        heading="Supported"
        gradientHeading="CURRENCIES"
      ></HeadingComponent>
      <HStack spacing={[2, 5, 10]} p={[2, 5, 10]}>
        {supportedCurrency.map((currencyObject, key) => {
          return (
            <CenterComponent
              style={{
                px: 10,
              }}
              key={key}
            >
              <Image
                src={currencyObject?.logo}
                alt={currencyObject?.name}
                width={50}
                height={50}
              ></Image>
            </CenterComponent>
          );
        })}
      </HStack>
    </VStack>
  );
};
