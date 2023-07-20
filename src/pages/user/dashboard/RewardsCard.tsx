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
      name: 'Global Rewards',
      value: userRewardsObject?.weeklyRewardInUSD,
    },
    {
      name: 'Weekly Rewards',
      value: userRewardsObject?.upgradeRewardsInUSD,
    },
    // {
    //   name: 'IBP Rewards',
    //   value: userRewardsObject?.ibpReward,
    // },
  ];

  console.log(userRewardsObject);
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
