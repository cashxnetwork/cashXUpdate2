import { HStack, Image } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const LogoFull = () => {
  return (
    <Link to="/">
      <HStack spacing={2} cursor="pointer">
        <Image src="/CashXLogo.svg" alt="logo" w={150}></Image>
      </HStack>
    </Link>
  );
};
