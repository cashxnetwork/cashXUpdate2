import { Heading, Text, VStack } from '@chakra-ui/react';
import { HeadingComponent } from '../../../util/Ui';

export const AboutUs = () => {
  return (
    <VStack w="full" px={5} py={50} spacing={10} id="about-us">
      <HeadingComponent
        heading="Why join CashX"
        gradientHeading="NETWORK"
      ></HeadingComponent>
      <Heading
        size={["sm", 'md', 'lg']}
        maxW="5xl"
        textAlign="center"
        fontWeight={300}
      >
        <Text as="span" fontWeight={900}>
          CashX
        </Text>{' '}
        the token that’s not just a crypto token, but a life changing crypto
        networking concept built on the latest blockchain technology. This is
        the platform where everyone will receive huge referral bonus directly
        into their wallets by sharing and spreading Cashx Network.
      </Heading>
      <Heading
        size={['md', 'lg']}
        maxW="5xl"
        textAlign="center"
        fontWeight={300}
      >
        <Text as="span" fontWeight={900}>
          CashX
        </Text>{' '}
        team has no control over how much you can earn. All the transactions are
        instant and automatic. Early entry into the system is very important as
        more senior level you reach, higher the upgrade income you receive.
      </Heading>
      <Heading
        size={['md', 'lg']}
        maxW="5xl"
        textAlign="center"
        fontWeight={300}
      >
        Some portion of joining fee goes to{' '}
        <Text as="span" fontWeight={900}>
          CashX
        </Text>{' '}
        liquidity which increases the value to the token gradually.
      </Heading>
    </VStack>
  );
};
