import { FcComboChart } from 'react-icons/fc';
import { BalanceContainer } from '../../../components/BalanceContainer';
import { CardContainer } from '../../../components/CardContainer';
import { useGetUserBusiness } from '../../../hooks/ReferralHooks';

function BusinessCard({
  userAddress,
}: {
  userAddress: `0x${string}`;
}) {
  const userBusiness = useGetUserBusiness(userAddress);
  const userValueObject = [
    {
      name: 'Self Business',
      value: userBusiness?.selfBusiness,
    },
    {
      name: 'Direct Business',
      value: userBusiness?.directBusiness,
    },
    {
      name: 'Team Business',
      value: userBusiness?.teamBusiness,
    },
    {
      name: 'Total Business',
      value: userBusiness?.totalBusiness,
    },
  ];

 
  return (
    <CardContainer heading="Business" icon={FcComboChart}>
      {userValueObject.map((valueObject, key) => {
        return (
          <BalanceContainer
            heading={valueObject?.name}
            value={valueObject?.value}
            key={key}
          ></BalanceContainer>
        );
      })}
    </CardContainer>
  );
}

export default BusinessCard;
