import {
  Heading,
  Icon,
  IconButton,
  Show,
  Tooltip,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FcAreaChart,
  FcConferenceCall,
  FcExternal,
  FcGoodDecision,
  FcPositiveDynamic,
} from 'react-icons/fc';
import { GoHome } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useGetUserBusiness } from '../../hooks/ReferralHooks';

// @ts-ignore
const MotionIconButton = motion(IconButton);

function NavUserMenu({
  userAddress,
  onClick,
}: {
  userAddress: string;
  onClick?: () => void;
}) {
  const { address } = useAccount();
  const userBusiness = useGetUserBusiness(address);
  console.log(userBusiness);
  const menuObject = [
    {
      icon: GoHome,
      name: 'Home',
      link: '/',
    },
    {
      icon: FcAreaChart,
      name: 'Dashboard',
      link: `/user/dashboard`,
    },
    {
      icon: FcConferenceCall,
      name: 'Team',
      link: `/user/team`,
    },
    // {
    //   icon: FcPositiveDynamic,
    //   name: 'Staking',
    //   link: `/user/staking`,
    // },
    {
      icon: userBusiness?.selfBusiness > 0 ? FcExternal : FcGoodDecision,
      name: userBusiness?.selfBusiness > 0 ? 'Upgrade' : 'Register',
      link: `/registration`,
    },
  ];
  return (
    <Wrap
      w="full"
      align="center"
      justify="center"
      direction={['row', 'row', 'column']}
    >
      {menuObject.map((menuObject, key) => {
        return (
          <Tooltip
            key={key}
            label={menuObject?.name}
            borderRadius="xl"
            placement="right"
            fontSize="xl"
            hasArrow
          >
            <VStack>
              <Link to={menuObject?.link}>
                <MotionIconButton
                  aria-label={`Icon button for nav user ${menuObject?.name}`}
                  icon={<Icon as={menuObject?.icon} boxSize={8} />}
                  boxSize={70}
                  borderRadius="3xl"
                  whileHover={{
                    borderRadius: '40%',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 700,
                  }}
                  onClick={onClick}
                ></MotionIconButton>
              </Link>
              <Show below="md">
                <Heading size="sm">{menuObject?.name}</Heading>
              </Show>
            </VStack>
          </Tooltip>
        );
      })}
    </Wrap>
  );
}

export default NavUserMenu;
