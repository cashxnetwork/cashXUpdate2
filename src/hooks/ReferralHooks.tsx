import { useContractRead, useNetwork } from 'wagmi';
import {
  AddressZero,
  ReferralV1ContractObject,
} from '../constants/ContractAddress';
import { supportedNetworkInfo } from '../constants/SupportedNetworkInfo';
import { formatNumberWithMaxDecimals } from '../util/UtilHooks';

export const useContractCall = ({
  functionName,
  args,
}: {
  functionName: string;
  args?: any[];
}) => {
  const { chain } = useNetwork();
  const currentNetwork = supportedNetworkInfo[chain?.id ?? 137];

  const { data, isError, isLoading, error } = useContractRead({
    address: currentNetwork?.referralContractAddress,
    abi: ReferralV1ContractObject?.abi,
    functionName: functionName,
    args: args ?? [],
  });

  if (isError) {
    console.log('Referral Hook Error', error?.message);
    return undefined;
  }

  return data;
};

export type UpgradePlanInfoValueType = {
  id: number;
  valueToUpgradeInUSD: bigint;
};

export const useUpgradePlans = () => {
  const value = useContractCall({
    functionName: 'getUpgradePlans',
  });

  const valueObject = {
    upgradePlans: value ? (value?.[0] as UpgradePlanInfoValueType[]) : [],
    upgradePlansCount: value ? (value?.[1] as number) : 0,
  };

  return valueObject;
};

export const useGetUserLimits = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserLimit',
    args: [userAddress],
  });

  const valueObject = {
    maxLimit: value
      ? formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3)
      : 0,
    currentLimit: value
      ? formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3)
      : 0,
    limitRemaingvalue: value
      ? formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3)
      : 0,
  };

  return valueObject;
};

export const useGetUserLevelToUpgrade = (
  userAddress: `0x${string}` | undefined
) => {
  const value = useContractCall({
    functionName: 'getUserCurrentUpgradeLevel',
    args: [userAddress],
  });

  return value ? (value?.[0] as number) : 0;
};

export const useNeedNativeToRegister = () => {
  const value = useContractCall({
    functionName: 'needNativeToRegister',
  });

  return value;
};

export const useNativePrice = () => {
  const value = useContractCall({
    functionName: 'getNativePriceInUSD',
  });

  return value ? Number(value) : 0;
};

export const useGetUserBusiness = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserBusiness',
    args: [userAddress],
  });

  const valueObject = {
    selfBusiness: value
      ? Number(formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3))
      : 0,
    directBusiness: value
      ? Number(formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3))
      : 0,
    teamBusiness: value
      ? Number(formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3))
      : 0,
    totalBusiness: value
      ? Number(formatNumberWithMaxDecimals(Number(value[3]) / 10 ** 18, 3))
      : 0,
  };

  return valueObject;
};

export const useGetUserRewards = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserRewards',
    args: [userAddress],
  });

  const valueObject = {
    referralRewardInUSD: value
      ? formatNumberWithMaxDecimals(Number(value[0]) / 10 ** 18, 3)
      : 0,
    weeklyRewardInUSD: value
      ? formatNumberWithMaxDecimals(Number(value[1]) / 10 ** 18, 3)
      : 0,
    upgradeRewardsInUSD: value
      ? formatNumberWithMaxDecimals(Number(value[2]) / 10 ** 18, 3)
      : 0,
  };

  return valueObject;
};

export type TypeTeamValueObject = {
  referrer: `0x${string}`;
  referees: `0x${string}`[];
  refereeCount: number;
  refereeAssigned: `0x${string}`[] | [];
  refereeAssignedCount: number;
  team: TypeTeamStruct[];
  teamCount: number;
}

export type TypeTeamStruct = {
  teamMember: `0x${string}`;
  level: number;
}

export const useGetUserTeam = (userAddress: `0x${string}` | undefined) => {
  const value = useContractCall({
    functionName: 'getUserTeam',
    args: [userAddress],
  });

  const valueObject: TypeTeamValueObject = {
    referrer: value ? (value[0] as `0x${string}`) : AddressZero,
    referees: value ? (value[1] as `0x${string}`[]) : [],
    refereeCount: value ? Number(value[2]) : 0,
    refereeAssigned: value ? (value[3] as `0x${string}`[]) : [],
    refereeAssignedCount: value ? Number(value[4]) : 0,
    team: value ? value[5] as TypeTeamStruct[] : [],
    teamCount: value ? Number(value[6]) : 0,
  };

  return valueObject;
};

export const useGetWeeklyRewardToBeDistributed = () => {
  const value = useContractCall({
    functionName: 'getWeeklyRewardToBeDistributed',
    args: [],
  });

  return value;
};

export const useGetRegistrationsStats = () => {
  const value = useContractCall({
    functionName: 'getRegistrationsStats',
    args: [],
  });

  return value;
};
