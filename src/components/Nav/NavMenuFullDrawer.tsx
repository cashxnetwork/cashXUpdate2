import { ChevronRightIcon } from '@chakra-ui/icons';
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
      <Drawer isOpen={isOpen} onClose={onToggle} placement="left">
        <DrawerOverlay></DrawerOverlay>
        <DrawerContent
          borderRightRadius="50px"
          bgColor={useColorModeValue('white', 'gray.900')}
        >
          <DrawerHeader />
          <DrawerCloseButton />
          <DrawerBody>
            <VStack py={20}>
              <NavMenuFullLinks
                style={{
                  direction: 'column',
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
