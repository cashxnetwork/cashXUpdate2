import {
  Hide,
  Image,
  Show
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export const Logo = () => {
  return (
    <Link to="/">
      <Hide below="sm">
        <Image src="/MarsNextLogoFull.svg" alt="logo" w={200}></Image>
      </Hide>
      <Show below="sm">
        <Image src="/MarsNextRocketLogo.svg" alt="logo" w={7}></Image>
      </Show>
    </Link>
  );
};
