import { Heading, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { HeadingComponent } from '../../../util/Ui';

export const AboutUs = () => {
  return (
    <VStack w="full" px={5} py={100} spacing={10} id="about-us">
      <HeadingComponent
        heading="Why is CashX"
        gradientHeading="PROTOCOL"
      ></HeadingComponent>
      <Heading
        size={['md', 'lg']}
        maxW="5xl"
        textAlign="center"
        fontWeight={500}
        opacity={0.75}
      >
        CashX the token that’s not just a crypto token, but a life changing
        crypto networking concept built on the latest blockchain technology.
        This is the platform where everyone will receive huge referral bonus
        directly into their wallets by sharing and spreading Cashx Network.
        CASHX team has no control over how much you can earn. All the
        transactions are instant and automatic. Early entry into the system is
        very important as more senior level you reach, higher the upgrade income
        you receive. Some portion of joining fee goes to $CASHX liquidity which
        increases the value to the token gradually.
      </Heading>
    </VStack>
  );
};
