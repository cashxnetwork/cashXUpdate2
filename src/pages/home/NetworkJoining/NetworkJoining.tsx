import {
  Box,
  Center,
  Heading,
  VStack,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { HeadingComponent } from '../../../util/Ui';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { PageWrapper } from '../../../util/PageWrapper';

ChartJS.register(ArcElement, Tooltip, Legend);

export const NetworkJoining = () => {
  const chartBorderColor = useColorModeValue('white', 'black');
  const data = {
    labels: [
      '$15 | Referral Rewards',
      '$5 | Dev & Core Team',
      '$4 | Liquidity Generation',
      '$1 | Weekly Rewards',
    ],
    datasets: [
      {
        data: [60, 20, 16, 4],
        backgroundColor: ['cyan', 'pink', 'yellow', 'purple'],
        borderColor: chartBorderColor,
        borderWidth: 10,
        borderRadius: 10,
      },
    ],
  };
  return (
    <PageWrapper>
      <HeadingComponent
        heading="Benefits of joining"
        gradientHeading="NETWORK"
      ></HeadingComponent>
      <VStack boxSize={[400, 500, 600]}>
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                fullSize: true,
                labels: {
                  font: {
                    size: useBreakpointValue(
                      {
                        base: 17,
                        md: 20,
                      },
                      {
                        fallback: 'md',
                      }
                    ),
                  },
                },
              },
            },
            maintainAspectRatio: true,
          }}
        />
      </VStack>
      <VStack>
        <Heading>Network Joining Fee</Heading>
        <Heading
          fontSize="5xl"
          textAlign="center"
          bgGradient="linear(to-r, green.200, orange.500)"
          bgClip="text"
        >
          $25 worth of BNB
        </Heading>
      </VStack>
    </PageWrapper>
  );
};
