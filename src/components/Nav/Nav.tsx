'use client';
import { HStack, Spacer } from '@chakra-ui/react';
import { ConnectWalletButton } from '../ConnectWalletButton';
import { Logo } from '../Logo';
import MenuButtonComponent from './MenuButtonComponent';

export const Nav = () => {
  return (
    <HStack
      w="full"
      align="center"
      justify="center"
      borderBottomRadius="3xl"
      bgColor={"transparent"}
      position="fixed"
      top={0}
      zIndex={1111}
      backdropFilter="auto"
      backdropBlur={"20px"}
      transition={'background-color 300ms linear'}
      px={[1, 2, 3, 5]}
      py={5}
    >
      <HStack w="full" px={5}>
        <Logo></Logo>
        <Spacer />
        <ConnectWalletButton showJazzicon={true}></ConnectWalletButton>
        <MenuButtonComponent />
      </HStack>
    </HStack>
  );
};
