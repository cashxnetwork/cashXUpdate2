import { FcConferenceCall } from 'react-icons/fc';
import { BalanceContainer } from '../../../components/BalanceContainer';
import { CardContainer } from '../../../components/CardContainer';
import { useGetUserTeam } from '../../../hooks/ReferralHooks';

function TeamCard({ userAddress }: { userAddress: `0x${string}` }) {
  const userTeamObject = useGetUserTeam(userAddress);
  const userValueObject = [
    {
      name: 'Direct Team',
      value: userTeamObject?.refereeCount,
    },
    {
      name: 'Team Assigned',
      value: userTeamObject?.refereeAssignedCount,
    },
    {
      name: 'Total Team',
      value: userTeamObject?.teamCount,
    },
  ];

  return (
    <CardContainer heading="Team" icon={FcConferenceCall}>
      {userValueObject.map((valueObject, key) => {
        return (
          <BalanceContainer
            heading={valueObject?.name}
            value={valueObject?.value}
            key={key}
            showIcon={false}
          ></BalanceContainer>
        );
      })}
    </CardContainer>
  );
}

export default TeamCard;
