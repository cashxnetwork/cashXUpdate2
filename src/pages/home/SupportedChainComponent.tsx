import { HStack, Image, VStack, useBreakpointValue } from '@chakra-ui/react';
import { BUSDLogoSVG, USDTLogoSVG } from '../../assets';
import { CenterComponent, HeadingComponent } from '../../util/Ui';

export const SupportedChainComponent = () => {
  const supprtedChains = [
    {
      name: 'BSC',
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
    <VStack py={[50, 75, 100]} spacing={5} w="full" borderTopRadius={['25%']}>
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
              <Image
                src={chainObject?.logo}
                alt={chainObject?.name}
                width={75}
                height={75}
              ></Image>
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
                width={75}
                height={75}
              ></Image>
            </CenterComponent>
          );
        })}
      </HStack>
    </VStack>
  );
};
