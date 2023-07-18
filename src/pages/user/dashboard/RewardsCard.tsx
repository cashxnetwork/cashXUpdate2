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
      value: userRewardsObject?.referralReward,
    },
    {
      name: 'Global Rewards',
      value: userRewardsObject?.globalReward,
    },
    {
      name: 'Weekly Rewards',
      value: userRewardsObject?.weeklyReward,
    },
    // {
    //   name: 'IBP Rewards',
    //   value: userRewardsObject?.ibpReward,
    // },
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
