import { useParams } from 'react-router-dom';
import RegistrationUI from '../../components/RegistrationUI/RegistrationUI';
import ReactSlickRegistration from './ReactSlickRegistration';

export default function RegistrationPage() {
  const { referrerAddress } = useParams();

  return <RegistrationUI referrerAddress={referrerAddress}></RegistrationUI>;
}
