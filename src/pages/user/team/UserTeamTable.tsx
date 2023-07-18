import { useGetUserTeam } from '../../../hooks/ReferralHooks';
import {
  Heading,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import UserTeamTableComponent from './UserTeamTableComponent';

function UserTeamTable({ userAddress }: { userAddress: `0x${string}` }) {
  const userTeamObject = useGetUserTeam(userAddress);
  const userTeamCount = userTeamObject.teamCount;
  const userTeamAddress = userTeamObject.team;
  const userTeamLevels = userTeamObject.teamLevels;
  return (
    <TableContainer
      w="full"
      bgColor={useColorModeValue('white', 'gray.900')}
      borderRadius="50px"
    >
      <Table size="lg">
        <Thead>
          <Tr>
            <Th>Level</Th>
            <Th>Address</Th>
            <Th isNumeric>Referred By</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userTeamCount > 0 ? (
            userTeamAddress.map((address: `0x${string}`, key: number) => {
              return (
                <UserTeamTableComponent
                  key={key}
                  level={key}
                  userAddress={address}
                  userTeamLevels={userTeamLevels}
                ></UserTeamTableComponent>
              );
            })
          ) : (
            <Heading size="sm" color="red">
              No team
            </Heading>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default UserTeamTable;
