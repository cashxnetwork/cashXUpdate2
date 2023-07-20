import { useGetUserTeam } from '../../../hooks/ReferralHooks';
import { Tag, Td, Tr } from '@chakra-ui/react';
import { shortenAddress } from '@usedapp/core';
import React from 'react';

function UserTeamTableComponent({
  level,
  userAddress,
}: {
  level: number;
  userAddress: `0x${string}`;
}) {
  const userTeamObject = useGetUserTeam(userAddress);
  return (
    <Tr>
      <Td>{level}</Td>
      <Td>
        <Tag size="lg" borderRadius="xl">
          {shortenAddress(userAddress)}
        </Tag>
      </Td>
      <Td isNumeric>
        <Tag size="lg" borderRadius="xl">
          {shortenAddress(userTeamObject?.referrer)}
        </Tag>
      </Td>
    </Tr>
  );
}

export default UserTeamTableComponent;
