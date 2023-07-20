import { FcScatterPlot } from 'react-icons/fc';
import { BalanceContainer } from '../../../components/BalanceContainer';
import { CardContainer } from '../../../components/CardContainer';
import { useGetUserRewards } from '../../../hooks/ReferralHooks';

export default function RewardsCard({
  userAddress,
}: {
  userAddress: `0x${string}`;
}) {
  const userRewardsObject = useGetUserRewards(userAddress);

  const userValueObject = [
    {
      name: 'Referral Rewards',
      value: userRewardsObject?.referralRewardInUSD,
    },
    {
      name: 'Weekly Rewards',
      value: userRewardsObject?.weeklyRewardInUSD,
    },
    {
      name: 'Upgrade Rewards',
      value: userRewardsObject?.upgradeRewardsInUSD,
    },
  ];

  return (
    <CardContainer heading="Rewards" icon={FcScatterPlot}>
      {userValueObject?.map((valueObject, key) => {
        return (
          <BalanceContainer
            key={key}
            heading={valueObject?.name}
            value={valueObject?.value}
          ></BalanceContainer>
        );
      })}
    </CardContainer>
  );
}
