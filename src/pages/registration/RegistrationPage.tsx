import { Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import { useGetPlansCount } from '../../hooks/VariablesHooks';
import ReactSlickRegistration from './ReactSlickRegistration';

export default function RegistrationPage() {
  const { referrerAddress } = useParams();
  const plansCount = useGetPlansCount();

  function planCountArray() {
    let count = [];

    for (let i = 0; i < plansCount; i++) {
      count.push(i);
    }

    return count;
  }

  console.log(plansCount)
  console.log(planCountArray())

  return (
    <ReactSlickRegistration>
      {planCountArray().length > 0 ? (
        planCountArray()?.map((planId, index) => (
          <RegistrationUI
            planId={planId}
            referrerAddress={referrerAddress}
            isLarge={true}
            key={index}
          ></RegistrationUI>
        ))
      ) : (
        <Spinner />
      )}
    </ReactSlickRegistration>
  );
}
