import { Box, Center, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { HeadingComponent } from '../../../util/Ui';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const Tokenomics = () => {
  const chartBorderColor = useColorModeValue('white', '#1A202C');
  const data = {
    labels: [
      'Fair Launch',
      'Liquidity',
      'Community Building',
      'CeX',
      'Staking',
      'Marketing',
    ],
    datasets: [
      {
        data: [30, 20, 25, 10, 10, 5],
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(255, 206, 86)',
          'rgba(75, 192, 192)',
          'rgba(153, 102, 255)',
          'rgba(255, 159, 64)',
        ],
        borderColor: [
          chartBorderColor,
          chartBorderColor,
          chartBorderColor,
          chartBorderColor,
          chartBorderColor,
          chartBorderColor,
        ],
        borderWidth: 10,
        borderRadius: 10,
        // circumference: 180,
        // rotation: 270,
      },
    ],
  };
  return (
    <VStack w="full" py={100} px={5} spacing={10}>
      <HeadingComponent
        heading="Community Centric"
        gradientHeading="TOKENOMICS"
      ></HeadingComponent>
      <VStack boxSize={[400, 500]}>
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                fullSize: true,
                align: 'center',
                labels: {
                  font: {
                    size: 25,
                  },
                },
              },
            },
            scales: {},
            maintainAspectRatio: true,
          }}
        />
      </VStack>
    </VStack>
  );
};
