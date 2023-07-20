import {
  Button,
  Icon,
  IconButton,
  IconButtonProps,
  VisuallyHidden,
  Wrap,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { JSXElementConstructor, ReactElement, ReactNode } from 'react';
import {
  FaBlog,
  FaDiscord,
  FaGithub,
  FaTelegram,
  FaTwitter,
} from 'react-icons/fa';

const iconsObject = [
  {
    label: 'Twitter',
    icon: FaTwitter,
    href: 'https://twitter.com/CashXnetwork',
  },
  {
    label: 'Telegram',
    icon: FaTelegram,
    href: 'https://t.me/CashXnetwork',
  },
  {
    label: 'Blog',
    icon: FaBlog,
    href: 'https://blog.cashx.network',
  },
  {
    label: 'Github',
    icon: FaGithub,
    href: 'https://docs.cashx.network',
  },
];

const SocialMediaIconsButton = ({
  icon,
  label,
  href,
  style
}: {
  icon: ReactElement<any, string | JSXElementConstructor<any>> | undefined;
  label: string;
  href: string;
  style?: IconButtonProps
}) => {
  return (
    <IconButton
    // @ts-ignore
      aria-label="Social Media Icons Button"
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      target="_blank"
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      icon={icon}
      {...style}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
    </IconButton>
  );
};

export const SocialMediaIcons = ({style}:{style?: IconButtonProps}) => {
  return (
    <Wrap spacing={3} align="center" justify="center">
      {iconsObject?.map((iconsObject, key) => {
        return (
          <SocialMediaIconsButton
            key={key}
            label={iconsObject?.label}
            icon={<Icon as={iconsObject?.icon}></Icon>}
            href={iconsObject?.href}
            style={style}
          ></SocialMediaIconsButton>
        );
      })}
    </Wrap>
  );
};

export default SocialMediaIcons;
