import { useColorModeValue } from '@chakra-ui/react';
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { bsc, polygon } from 'wagmi/chains';
import { MyVeeMainnet } from '../lib/chains';

require('dotenv').config();

const chains = [bsc, MyVeeMainnet];
const projectId = '45d704544c109267d7939641749cca7d';

if (!projectId) {
  throw new Error('WalletConnect project id is not defined');
}

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export const ProviderWeb3Modal = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        defaultChain={polygon}
        themeMode={useColorModeValue('light', 'dark')}
      />
    </>
  );
};
