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
    <VStack spacing={5} maxW="3xl">
      <VStack
        spacing={0}
        fontSize={['5xl', '6xl', '7xl']}
        fontWeight={800}
        fontFamily="heading"
        lineHeight={1}
      >
        {/* <Text textAlign="center">{mainHeading}</Text> */}
        <Text>POWERFUL</Text>
        <Text>CRYPTO</Text>
        <Text>REWARD</Text>
        <Text>NETWORK</Text>
      </VStack>
      <Heading
        size="lg"
        textAlign="center"
        px={5}
        lineHeight={1.2}
        maxW="2xl"
        fontWeight={500}
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
          ENTER THE APP
        </Button>
      </Link>
    </VStack>
  );
};
