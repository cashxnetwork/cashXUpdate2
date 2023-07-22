import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  VStack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { NavMenuFullLinks } from './NavMenuFullLinks';
import SocialMediaIcons from '../SocialMediaIcons';
import { Logo } from '../Logo';
import { LogoFull } from '../LogoFull';

export const NavMenuFullDrawer = () => {
  const { isOpen, onOpen, onToggle } = useDisclosure();
  return (
    <>
      <IconButton
        aria-label="Left Menu Button"
        icon={<ChevronRightIcon />}
        onClick={onToggle}
        size="sm"
        isRound
      ></IconButton>
      <Drawer isOpen={isOpen} onClose={onToggle} placement="left" size="xs">
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent
          borderRightRadius="50px"
          bgColor={useColorModeValue('white', 'gray.900')}
        >
          <DrawerHeader>
            <IconButton
              aria-label="Drawer Close Button"
              onClick={onToggle}
              icon={<ChevronLeftIcon />}
              size="sm"
              isRound
            ></IconButton>
          </DrawerHeader>
          <DrawerBody>
            <VStack py={5}>
              <LogoFull />
            </VStack>
            <VStack py={5}>
              <NavMenuFullLinks
                style={{
                  direction: 'column',
                  onClick: onToggle,
                }}
              />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <VStack w="full" spacing={5}>
              <Divider></Divider>
              <SocialMediaIcons />
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
