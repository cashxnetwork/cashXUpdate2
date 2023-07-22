import ReferralV1ContractInterface from '../contracts/artifacts/contracts/CashXProtocolReferral.sol/CashXProtocolReferral.json';
import PriceOracleInterface from '../contracts/artifacts/contracts/PriceOracle.sol/PriceOracle.json';
import { erc20ABI } from 'wagmi';

export const AddressZero: `0x${string}` =
  '0x0000000000000000000000000000000000000000';
export const AddressDead: `0x${string}` =
  '0x000000000000000000000000000000000000dEaD';

export type ContractObject = {
  abi: any;
  polygonAddress: `0x${string}`;
  bscAddress: `0x${string}`;
  myveeAddress: `0x${string}`;
};

export type TokenContractObject = {
  abi: any;
  polygonAddress: `0x${string}`;
  bscAddress: `0x${string}`;
  myveeAddress: `0x${string}`;
};

export const ReferralV1ContractObject: ContractObject = {
  abi: ReferralV1ContractInterface?.abi,
  polygonAddress: AddressZero,
  bscAddress: '0xcb31dB819d9ad85A46463bbA161D85532b8Ad6e7',
  myveeAddress: '0xcb31dB819d9ad85A46463bbA161D85532b8Ad6e7',
};

export const PriceOracleObject: ContractObject = {
  abi: PriceOracleInterface?.abi,
  polygonAddress: AddressZero,
  bscAddress: '0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee',
  myveeAddress: '0x9c85f470f9ba23dFC4fE9531933C2ce2c1739c39',
};

export const USDT: TokenContractObject = {
  abi: erc20ABI,
  polygonAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  bscAddress: '0x55d398326f99059fF775485246999027B3197955',
  myveeAddress: '0x3bcBA4C6223D98B9265601b6129A9436F810669B',
};

export const BUSD: TokenContractObject = {
  abi: erc20ABI,
  polygonAddress: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39',
  bscAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  myveeAddress: '0xc84837B0b1Ea22A831Cf000aFB4E2D88BDE8c1E7',
};
