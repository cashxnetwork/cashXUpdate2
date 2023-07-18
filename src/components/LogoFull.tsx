import { HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const LogoFull = () => {
  return (
    <Link to="/">
      <HStack spacing={2} cursor="pointer">
        <Image src="/MarsNextLogoFull.svg" alt="logo" w={200}></Image>
      </HStack>
    </Link>
  );
};
