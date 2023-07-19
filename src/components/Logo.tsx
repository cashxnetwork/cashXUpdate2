import { Hide, Image, Show } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/">
      <Image src="/CashXLogo.svg" alt="logo" w={[100, 150]}></Image>
    </Link>
  );
};
