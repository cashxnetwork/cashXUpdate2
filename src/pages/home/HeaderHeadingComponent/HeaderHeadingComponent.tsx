'use client';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Button,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const HeaderHeadingComponent = () => {
  const mainHeading = 'POWERFUL CRYPTO REWARD NETWORK';
  const secondaryHeading =
    'A fully #decentralised protocol that distributes rewards for joining the CashX network';
  return (
    <VStack spacing={5} maxW="4xl">
      <VStack
        spacing={0}
        fontSize={['5xl', '6xl', '7xl']}
        fontWeight={800}
        fontFamily="heading"
        lineHeight={1}
        opacity={useColorModeValue(0.75, 1)}
      >
        <Text textAlign="center">{mainHeading}</Text>
      </VStack>
      <Heading
        size="lg"
        textAlign="center"
        px={5}
        lineHeight={1.2}
        maxW="3xl"
        opacity={0.75}
      >
        {secondaryHeading}
      </Heading>
      <Link to="/registration">
        <button></button>
        <Button
          w={[250, 300, 400]}
          h={16}
          borderRadius={20}
          rightIcon={<ChevronRightIcon />}
          zIndex={1}
          borderBottomWidth="thick"
          variant="solid"
          colorScheme="twitter"
        >
          LAUNCH APP
        </Button>
      </Link>
    </VStack>
  );
};
