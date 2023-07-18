import { Spinner } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import { useGetPlansCount } from '../../hooks/VariablesHooks';
import ReactSlickRegistration from './ReactSlickRegistration';

export default function RegistrationPage() {
  const { referrerAddress } = useParams();
  const plansCount = useGetPlansCount();

  console.log(plansCount)

  return (
    <ReactSlickRegistration>
      {plansCount.length > 0 ? (
        plansCount?.map((planId, index) => (
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
