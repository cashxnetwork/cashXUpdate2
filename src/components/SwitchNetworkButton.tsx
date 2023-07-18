import { WalletConnectLogoSVG } from '../assets';
import { Button, Image } from '@chakra-ui/react';
import { useWeb3Modal } from '@web3modal/react';

function SwitchNetworkButton() {
    const { isOpen, open, close, setDefaultChain } = useWeb3Modal();
  return (
    <Button
      leftIcon={
        <Image
          src={WalletConnectLogoSVG}
          alt="Wallet Connect Logo"
          width={30}
        ></Image>
      }
      borderRadius="full"
      onClick={async () => {
        await open({route: 'SelectNetwork'});
      }}
    >
      Switch Network
    </Button>
  );
}

export default SwitchNetworkButton;
