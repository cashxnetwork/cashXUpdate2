import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Heading,
  Icon,
  Tag,
  VStack,
  Wrap,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { BsFillCalendar2HeartFill, BsFire } from 'react-icons/bs';
import { FaChartLine, FaUsers } from 'react-icons/fa';
import { MdGroups3 } from 'react-icons/md';
import { CenterComponent, HeadingComponent } from '../../../util/Ui';
import { Link } from 'react-router-dom';

const BoxComponent = ({
  icon,
  heading,
  value,
  text,
}: {
  icon: IconType;
  heading: string;
  value: number;
  text: string;
}) => {
  return (
    <CenterComponent
      style={{
        w: 250,
        h: 350,
      }}
    >
      <VStack w="full" spacing={5}>
        <Icon as={icon} boxSize={10}></Icon>
        <Tag colorScheme="green" fontWeight={900}>
          {heading}
        </Tag>
        <Heading
          color="orange.500"
          size="3xl"
          fontWeight={900}
          fontFamily="unset"
        >
          {value}%
        </Heading>
        <Heading size="sm" textAlign="center">
          {text}
        </Heading>
      </VStack>
    </CenterComponent>
  );
};

const features = [
  {
    heading: 'Earn Upto',
    icon: MdGroups3,
    text: 'Community Spreading Rewards.',
    value: 60,
  },
  {
    heading: 'Levels',
    icon: FaChartLine,
    text: 'Full fees of upgrading value.',
    value: 100,
  },
  {
    heading: 'Liquidity Pool',
    icon: BsFire,
    text: '5 USD to liquidity of every registration.',
    value: 20,
  },
  {
    heading: 'Weekly Rewards',
    icon: BsFillCalendar2HeartFill,
    text: '4% of weekly total registration valuen to a random user.',
    value: 4,
  },
];

export const PlanDiscriptionComponent = () => {
  return (
    <VStack w="full" minH="80vh" py="10vh" spacing={10}>
      <HeadingComponent
        heading="A protocol made for"
        gradientHeading="EVERYONE"
      ></HeadingComponent>
      <Wrap
        spacing={10}
        align="center"
        justify="center"
        p={5}
        borderRadius="50px"
      >
        {features.map((featuresBbject, key) => {
          return <BoxComponent {...featuresBbject} key={key}></BoxComponent>;
        })}
      </Wrap>
      <Box maxW={500} minW={250} w="full" px={10}>
        <Link to="/registration">
          <Button
            w="full"
            rightIcon={<ChevronRightIcon />}
            fontSize="lg"
            h={20}
            borderRadius={20}
            borderBottomWidth="thick"
            colorScheme="twitter"
          >
            Enter the app
          </Button>
        </Link>
      </Box>
    </VStack>
  );
};
