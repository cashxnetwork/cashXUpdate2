import {
  Box,
  HStack,
  Heading,
  Icon,
  Radio,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { CenterComponent, HeadingComponent } from '../../../util/Ui';
import ReactSlickComponent from '../../../components/ReactSlickComponent';
import { BiRadioCircleMarked } from 'react-icons/bi';

export const Roadmap = () => {
  const roadmapObject = [
    {
      name: 'PHASE 1',
      discription: [
        'Designed the concept.',
        'Test beta version of reward DApp.',
        'Social presence.',
        'Mainnet Deployment',
        'KYC & Audit',
        'Marketting campaigns',
        'Focus on community building',
      ],
    },
    {
      name: 'PHASE 2',
      discription: [
        'Launch fully decentralised web3 DApp.',
        'Fair launch CashX on one of the top launchpad.',
        'Kick start reward system.',
        'Mainnet Deployment.',
        'Gain 1000+ holder.',
        'CMC/CoinGecko listing',
        'Trend CashX protocol on twitter & other social platforms.',
      ],
    },
    {
      name: 'PHASE 3',
      discription: [
        'Listing on top CeX.',
        'Staking & farming live for community.',
        'Web3 based collaborations.',
        'CashX based twitter bot.',
        '10000+ holders.',
        'Go viral.',
        'Give aways.',
        '10x value of the fairlaunch.',
      ],
    },
    {
      name: 'PHASE 4',
      discription: [
        'Listing on top CeX.',
        'Staking & farming live for community.',
        'Web3 based collaborations.',
        'CashX based twitter bot.',
        '10000+ holders.',
        'Go viral.',
        'Give aways.',
        '10x value of the fairlaunch.',
      ],
    },
  ];

  return (
    <VStack w="full" px={5} py={50} spacing={10}>
      <HeadingComponent
        heading="A commited"
        gradientHeading="ROADMAP"
      ></HeadingComponent>
      <ReactSlickComponent>
        {roadmapObject?.map((roadmapObject, key) => {
          return (
            <Box key={key}>
              <CenterComponent
                style={{
                  minH: 500,
                  w: 300,
                  alignItems: 'flex-start',
                }}
              >
                <Stack spacing={10} p={5}>
                  <Heading size="lg">{roadmapObject?.name}</Heading>
                  <Stack>
                    {roadmapObject?.discription?.map((discription, keyDis) => {
                      return (
                        <HStack key={keyDis}>
                          <Icon as={BiRadioCircleMarked}></Icon>
                          <Text>{discription}</Text>
                        </HStack>
                      );
                    })}
                  </Stack>
                </Stack>
              </CenterComponent>
            </Box>
          );
        })}
      </ReactSlickComponent>
    </VStack>
  );
};
