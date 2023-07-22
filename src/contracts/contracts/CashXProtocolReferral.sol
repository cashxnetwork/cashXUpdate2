// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

interface IUniswapRouter {
    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB, uint256 liquidity);
}

interface AggregatorV3Interface {
    function latestAnswer() external view returns (uint256);

    function decimals() external view returns (uint8);
}

struct UpgradeStruct {
    uint8 id;
    uint256 valueToUpgradeInUSD;
}

struct RefereeStruct {
    address referee;
    address assignedTo;
}

struct TeamStruct {
    address teamMember;
    uint8 level;
}

struct AccountStruct {
    address self;
    address parent;
    address referrer;
    address[] referee;
    RefereeStruct[] refereeAssigned;
    TeamStruct[] team;
    uint256 selfBusinessInUSD;
    uint256 upgradedValueInUSD;
    uint8 upgradeId;
    uint256 directBusinessInUSD;
    uint256 teamBusinessInUSD;
    uint256 referralRewardsInUSD;
    uint256 weeklyRewardsInUSD;
    uint256 upgradeRewardsInUSD;
    uint256 userRandomIndex;
}

contract CashXProtocolReferral is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address[] private _users;
    address[] private _randomUserList;

    uint256 private _totalRegistrationValueInUSD;
    uint256 private _referralPaidInUSD;
    uint256 private _randomRewardsPaidInUSD;
    uint256 private _weeklyRewardsPaidInUSD;

    address private _teamWallet;
    uint8 private _teamWalletRate;

    uint256 private _valueToCreateLiquidityInWei;
    uint8 private _liquidityCreateRate;

    uint256 private _weeklyRewardValueInWei;
    uint8 private _weeklyRewardRate;
    uint256 private _weeklyRewardTimestamp;

    // uint8[] private _levelRates;
    uint8 private _levelRatesFixed;
    uint8 private _levelsToCount;
    uint256 private _refereeLimit;

    address private _defaultReferrer;
    uint256 private _registrationValueInUSD;

    address private _liquidityWallet;

    address[] private _supportedChainLinkOracleAddress;

    mapping(address => AccountStruct) private _mappingAccounts;
    mapping(uint8 => UpgradeStruct) private _mappingUpgrade;
    mapping(address => bool) private _mappingOracle;

    event Registration(
        address by,
        address to,
        address user,
        uint256 valueInWei
    );

    event RegistrationAssigned(address by, address to, address user);

    event ReferrerAdded(address by, address user);
    event ReferrerNoAdded(string reason);

    event ParentAdded(address by, address to, address user);

    event TeamAddressAdded(address to, address user, uint32 level);

    event ReferralRewardsPaid(
        address to,
        address user,
        uint256 valueInWei,
        uint32 level
    );

    event UpgradeRewardPaid(address to, address by, uint256 valueInWei);
    event UpgradeRewardNotPaid(string reason);

    event WeeklyRewardPaid(address to, uint256 valueInWei);
    event WeeklyRewardNotPaid(string reason);

    event TeamWalletRewardPaid(address to, uint256 valueInWei);

    event AddedToRandomList(address user);
    event RemovedFromRandomList(address user);

    receive() external payable {}

    function initialize() public initializer {
        _defaultReferrer = 0xeb1100091Ce830ba58A04834c35D29B75b53eb74; //Need to change
        _registrationValueInUSD = 25 * 10 ** 18;

        _levelRatesFixed = 60;
        _levelsToCount = 8;
        _refereeLimit = 2;

        _teamWallet = 0x76b7c991C3Ef93B6771fAC97a984a2Cb37962fbc; // need to change
        _teamWalletRate = 20;

        _liquidityCreateRate = 16;
        _weeklyRewardRate = 4;
        _weeklyRewardTimestamp = block.timestamp;

        _liquidityWallet = 0xefA6077f510B10a6C1B2f8dA24a89Fc561aC9445; // yet to decide

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function setDefaults() external onlyOwner {
        _mappingAccounts[_defaultReferrer].self = _defaultReferrer;
        _mappingAccounts[_defaultReferrer].parent = _defaultReferrer;
        _randomUserList.push(_defaultReferrer);
        _supportedChainLinkOracleAddress.push(
            0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
        );
        _supportedChainLinkOracleAddress.push(
            0x9c85f470f9ba23dFC4fE9531933C2ce2c1739c39
        );
        _mappingOracle[0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE] = true;
        _mappingOracle[0x9c85f470f9ba23dFC4fE9531933C2ce2c1739c39] = true;
    }

    function updateUpgradePlans(
        uint256[] calldata _valueToUpgradeInDecimals
    ) external onlyOwner {
        for (uint8 i; i < _valueToUpgradeInDecimals.length; ++i) {
            _mappingUpgrade[i] = UpgradeStruct(
                i + 1,
                _valueToUpgradeInDecimals[i] * 10 ** 18
            );
        }
    }

    function _getUpgradePlansCount() private view returns (uint8 count) {
        for (uint8 i; i < 50; i++) {
            if (_mappingUpgrade[i].id == 0) {
                break;
            }

            count++;
        }
    }

    function getUpgradePlans()
        external
        view
        returns (UpgradeStruct[] memory upgradePlans, uint8 upgradePlansCount)
    {
        upgradePlansCount = _getUpgradePlansCount();
        UpgradeStruct[] memory plansAccount = new UpgradeStruct[](
            upgradePlansCount
        );

        for (uint8 i; i < upgradePlansCount; ++i) {
            plansAccount[i] = _mappingUpgrade[i];
        }

        upgradePlans = plansAccount;
    }

    function getUpgradePlansById(
        uint8 _id
    ) external view returns (UpgradeStruct memory) {
        return _mappingUpgrade[_id];
    }

    function _hasReferrer(
        AccountStruct memory userAccount
    ) private pure returns (bool hasReferrer) {
        if (userAccount.referrer != address(0)) {
            hasReferrer = true;
        }
    }

    function _isRefereeLimitReached(
        AccountStruct memory _userAccount
    ) private view returns (bool reached) {
        if (
            _userAccount.referee.length > _refereeLimit ||
            _userAccount.referee.length == _refereeLimit
        ) {
            reached = true;
        }
    }

    function _getRandomReferrer() private view returns (address) {
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    blockhash(block.number - 1)
                )
            )
        );

        uint256 randomIndex = randomHash % _randomUserList.length;
        return _randomUserList[randomIndex];
    }

    function _addToRandomList(AccountStruct memory _userAccount) private {
        _userAccount.userRandomIndex = _randomUserList.length;
        _randomUserList.push(_userAccount.self);
        emit AddedToRandomList(_userAccount.self);
    }

    function _removeFromRandomList(AccountStruct storage _userAccount) private {
        _randomUserList[_userAccount.userRandomIndex] = _randomUserList[
            _randomUserList.length - 1
        ];
        _randomUserList.pop();

        emit RemovedFromRandomList(_userAccount.self);
    }

    function _addUpline(
        AccountStruct storage _referrerAccount,
        AccountStruct storage _userAccount
    ) private {
        _userAccount.referrer = _referrerAccount.self;
        emit ReferrerAdded(_referrerAccount.self, _userAccount.self);
    }

    function _addReferrer(address _referrer, address _referee) private {
        AccountStruct storage userAccount = _mappingAccounts[_referee];
        require(_referrer != _referee, "You cannot refer yourself.");

        AccountStruct storage referrerAccount;

        if (_referrer == address(0)) {
            referrerAccount = _mappingAccounts[_defaultReferrer];
        } else {
            referrerAccount = _mappingAccounts[_referrer];
        }

        if (!_isRefereeLimitReached(referrerAccount)) {
            _addUpline(referrerAccount, userAccount);

            referrerAccount.referee.push(_referee);

            if (_isRefereeLimitReached(referrerAccount)) {
                _removeFromRandomList(referrerAccount);
            }
        } else {
            _removeFromRandomList(referrerAccount);
            AccountStruct storage randomAccount = _mappingAccounts[
                _getRandomReferrer()
            ];
            _addUpline(randomAccount, userAccount);
            if (_isRefereeLimitReached(randomAccount)) {
                _removeFromRandomList(randomAccount);
            }

            emit RegistrationAssigned(
                referrerAccount.self,
                randomAccount.self,
                _referee
            );

            referrerAccount.refereeAssigned.push(
                RefereeStruct({
                    referee: _referee,
                    assignedTo: randomAccount.self
                })
            );

            if (userAccount.selfBusinessInUSD == 0) {
                _addToRandomList(userAccount);
            }

            randomAccount.referee.push(_referee);
        }

        if (userAccount.parent == address(0)) {
            userAccount.parent = referrerAccount.self;
            emit ParentAdded(
                userAccount.parent,
                userAccount.referrer,
                _referee
            );
        }

        uint8 levelsToCount = _levelsToCount;

        for (uint8 i; i < levelsToCount; i++) {
            if (userAccount.referrer == address(0)) {
                break;
            }

            referrerAccount = _mappingAccounts[userAccount.referrer];
            referrerAccount.team.push(
                TeamStruct({teamMember: _referee, level: i + 1})
            );

            emit TeamAddressAdded(referrerAccount.self, _referee, i + 1);

            userAccount = referrerAccount;
        }
    }

    function _registrationNative(
        address _referrer,
        address _referee,
        uint256 _msgValueInUSD,
        uint256 _msgValue,
        uint256 _price
    ) private {
        uint256 registrationValueInUSD = _registrationValueInUSD;

        require(
            _msgValueInUSD >= (registrationValueInUSD * 95) / 100,
            "Value is less then registration value."
        );

        uint8 levelRates = _levelRatesFixed;
        uint8 levelsToCount = _levelsToCount;
        uint256 totalReferralPaidInUSD;

        AccountStruct storage userAccount = _mappingAccounts[_referee];
        AccountStruct storage referrerAccount = _mappingAccounts[_referrer];

        require(userAccount.selfBusinessInUSD == 0, "User already registered");

        if (userAccount.self == address(0)) {
            userAccount.self = _referee;
        }

        if (referrerAccount.self == address(0)) {
            referrerAccount.self = _referrer;
        }

        if (userAccount.selfBusinessInUSD == 0) {
            _users.push(_referee);
            _addToRandomList(userAccount);
        }

        userAccount.selfBusinessInUSD += _msgValueInUSD;

        if (!_hasReferrer(userAccount)) {
            _addReferrer(_referrer, _referee);
        } else {
            emit ReferrerNoAdded("User Already have referrer set.");
        }

        emit Registration(
            userAccount.parent,
            userAccount.referrer,
            userAccount.self,
            _msgValueInUSD
        );

        uint256 referralValueInWei = (_msgValue * levelRates) / 100;
        uint256 referrealValueInUSD = _valueToUSD(referralValueInWei, _price);
        AccountStruct storage parentAccount = _mappingAccounts[
            userAccount.parent
        ];

        if (parentAccount.self != address(0)) {
            payable(parentAccount.self).transfer(referralValueInWei);
            emit ReferralRewardsPaid(
                parentAccount.self,
                _referee,
                referralValueInWei,
                1
            );

            parentAccount.referralRewardsInUSD += referrealValueInUSD;
            parentAccount.directBusinessInUSD += _msgValueInUSD;
        }

        totalReferralPaidInUSD += referrealValueInUSD;

        for (uint8 i; i < levelsToCount; i++) {
            if (!_hasReferrer(userAccount)) {
                break;
            }

            referrerAccount = _mappingAccounts[userAccount.referrer];

            referrerAccount.teamBusinessInUSD += _msgValueInUSD;

            userAccount = referrerAccount;
        }

        uint256 teamValue = (_msgValue * _teamWalletRate) / 100;
        payable(_teamWallet).transfer(teamValue);
        emit TeamWalletRewardPaid(_teamWallet, teamValue);

        _referralPaidInUSD += totalReferralPaidInUSD;
        _totalRegistrationValueInUSD += _msgValueInUSD;

        uint256 liquidityValue = (_msgValue * _liquidityCreateRate) / 100;
        payable(_liquidityWallet).transfer(liquidityValue);
        _valueToCreateLiquidityInWei += liquidityValue;

        _weeklyRewardValueInWei += (_msgValue * _weeklyRewardRate) / 100;
    }

    function registrationNative(
        address _referrer,
        address _chainLinkOracleAddress
    ) external payable {
        require(_referrer != address(0), "Zero Address cannot be the referrer");
        require(
            _mappingOracle[_chainLinkOracleAddress] == true,
            "Currency You selected not supported"
        );

        uint256 msgValue = msg.value;
        uint256 priceInUSD = _priceInUSDWei(_chainLinkOracleAddress);
        uint256 _msgValueInUSD = _valueToUSD(msgValue, priceInUSD);
        _registrationNative(
            _referrer,
            msg.sender,
            _msgValueInUSD,
            msgValue,
            priceInUSD
        );
    }

    function _upgradeIdNative(
        uint256 _msgValue,
        uint256 _msgValueInUSD,
        address _userAddress
    ) private {
        AccountStruct storage userAccount = _mappingAccounts[_userAddress];
        uint8 userUpgradeId = userAccount.upgradeId;
        UpgradeStruct memory ugradeIdAccount = _mappingUpgrade[userUpgradeId];
        uint8 upgradePlansCount = _getUpgradePlansCount();

        require(
            _msgValueInUSD >= ugradeIdAccount.valueToUpgradeInUSD,
            "Value should be equal to upgrade value"
        );

        require(
            userUpgradeId < upgradePlansCount,
            "User consumed all upgrade plans"
        );

        userAccount.upgradedValueInUSD += _msgValueInUSD;

        for (uint i; i <= userUpgradeId; ++i) {
            if (userAccount.referrer == address(0)) {
                break;
            }

            AccountStruct storage referrerAccount = _mappingAccounts[
                userAccount.referrer
            ];

            if (i == userUpgradeId) {
                if (
                    referrerAccount.upgradeId > userUpgradeId &&
                    referrerAccount.self != address(0)
                ) {
                    referrerAccount.upgradeRewardsInUSD += _msgValueInUSD;
                    payable(referrerAccount.self).transfer(_msgValue);
                    emit UpgradeRewardPaid(
                        referrerAccount.self,
                        _userAddress,
                        _msgValue
                    );
                } else {
                    emit UpgradeRewardNotPaid(
                        "Upline has not upgraded. Amount transfered to liquidity wallet."
                    );

                    address liquidityWallet = _liquidityWallet;
                    payable(liquidityWallet).transfer(_msgValue);
                    emit UpgradeRewardPaid(
                        liquidityWallet,
                        _userAddress,
                        _msgValue
                    );
                }

                break;
            }

            userAccount = referrerAccount;
        }

        userAccount.upgradeId++;
    }

    function upgradeAccountNative(
        address _chainLinkOracleAddress
    ) external payable {
        require(
            _mappingOracle[_chainLinkOracleAddress] == true,
            "Currency not supported"
        );
        uint256 msgValue = msg.value;
        uint256 msgValueInUSD = _valueToUSD(
            msgValue,
            _priceInUSDWei(_chainLinkOracleAddress)
        );
        _upgradeIdNative(msgValue, msgValueInUSD, msg.sender);
    }

    function getUserCurrentUpgradeLevel(
        address _userAddress
    ) external view returns (uint8 level, uint256 totalUpgradeValueInUSD) {
        AccountStruct memory userAccount = _mappingAccounts[_userAddress];
        if (userAccount.upgradeId > 0) {
            level = userAccount.upgradeId;
        }

        totalUpgradeValueInUSD = userAccount.upgradedValueInUSD;
    }

    function getAllUsers() external view returns (address[] memory) {
        return _users;
    }

    function getRandomUserList() external view returns (address[] memory) {
        return _randomUserList;
    }

    function getContractDefaults()
        external
        view
        returns (
            address teamWallet,
            uint256 teamWalletRate,
            address liquidityWallet,
            uint256 liquidityCreationrate,
            address defaultReferrer,
            uint256 registrationValueInUSD
        )
    {
        teamWallet = _teamWallet;
        teamWalletRate = _teamWalletRate;
        liquidityWallet = _liquidityWallet;
        liquidityCreationrate = _liquidityCreateRate;
        defaultReferrer = _defaultReferrer;
        registrationValueInUSD = _registrationValueInUSD;
    }

    function getRegistrationsStats()
        external
        view
        returns (
            uint32 totalUser,
            uint256 totalRegistrationValueInUSD,
            uint256 totalReferralPaidInUSD,
            uint256 totalWeeklyRewardsPaidInUSD
        )
    {
        totalUser = uint32(_users.length);
        totalRegistrationValueInUSD = _totalRegistrationValueInUSD;
        totalReferralPaidInUSD = _referralPaidInUSD;
        totalWeeklyRewardsPaidInUSD = _weeklyRewardsPaidInUSD;
    }

    function getWeeklyRewardToBeDistributed()
        external
        view
        returns (uint256 _rewardValue, uint256 _remianingTime, uint256 _endTime)
    {
        _rewardValue = _weeklyRewardValueInWei;
        _endTime = _weeklyRewardTimestamp + 7 days;
        uint256 _currentTime = block.timestamp;
        if (_endTime > _currentTime) {
            _remianingTime = _endTime - _currentTime;
        }
    }

    function distributeWeeklyReward(address _chainLinkOracleAddress) external {
        require(
            _mappingOracle[_chainLinkOracleAddress] == true,
            "Currency not supported"
        );
        uint256 weeklyRewardValueInWei = _weeklyRewardValueInWei;
        uint256 weeklyRewardValueInUSD = _valueToUSD(
            weeklyRewardValueInWei,
            _priceInUSDWei(_chainLinkOracleAddress)
        );
        uint256 weeklyCounterEndTime = _weeklyRewardTimestamp + 7 days;
        uint256 _currentTime = block.timestamp;
        require(
            _currentTime >= weeklyCounterEndTime,
            "Weekly time is not over yet."
        );

        require(_weeklyRewardValueInWei > 0, "No rewards to distribute");

        address[] memory allUsers = _users;
        uint256 randomHash = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    blockhash(block.number - 1)
                )
            )
        );

        uint256 randomIndex = randomHash % allUsers.length;
        address globalAddress = allUsers[randomIndex];

        if (globalAddress != address(0)) {
            AccountStruct storage globalAddressAccount = _mappingAccounts[
                globalAddress
            ];
            globalAddressAccount.weeklyRewardsInUSD += weeklyRewardValueInUSD;
            payable(globalAddress).transfer(weeklyRewardValueInWei);

            delete _weeklyRewardValueInWei;
            _weeklyRewardTimestamp = block.timestamp;
            _weeklyRewardsPaidInUSD += weeklyRewardValueInUSD;
            emit WeeklyRewardPaid(globalAddress, weeklyRewardValueInUSD);
        } else {
            emit WeeklyRewardNotPaid(
                "Random address was zero address. Please try again"
            );
        }
    }

    function getUserAccount(
        address _userAddress
    ) external view returns (AccountStruct memory) {
        return _mappingAccounts[_userAddress];
    }

    function getUserTeam(
        address _userAddress
    )
        external
        view
        returns (
            address referrer,
            address[] memory referees,
            uint256 refereeCount,
            RefereeStruct[] memory refereeAssigned,
            uint256 refereeAssignedCount,
            TeamStruct[] memory team,
            uint256 teamCount
        )
    {
        AccountStruct memory userAccount = _mappingAccounts[_userAddress];
        referrer = userAccount.referrer;
        referees = userAccount.referee;
        refereeCount = userAccount.referee.length;
        refereeAssigned = userAccount.refereeAssigned;
        refereeAssignedCount = userAccount.refereeAssigned.length;
        team = userAccount.team;
        teamCount = userAccount.team.length;
    }

    function getUserBusiness(
        address _userAddress
    )
        external
        view
        returns (
            uint256 selfBusinessInUSD,
            uint256 directBusinessInUSD,
            uint256 teamBusinessInUSD,
            uint256 totalBusinessInUSD
        )
    {
        AccountStruct memory userAccount = _mappingAccounts[_userAddress];
        selfBusinessInUSD = userAccount.selfBusinessInUSD;
        directBusinessInUSD = userAccount.directBusinessInUSD;
        teamBusinessInUSD = userAccount.teamBusinessInUSD;
        totalBusinessInUSD =
            userAccount.teamBusinessInUSD +
            userAccount.selfBusinessInUSD;
    }

    function getUserRewards(
        address _userAddress
    )
        external
        view
        returns (
            uint256 referralRewardInUSD,
            uint256 weeklyRewardInUSD,
            uint256 upgradeRewardsInUSD,
            uint256 totalRewards
        )
    {
        AccountStruct memory userAccount = _mappingAccounts[_userAddress];
        referralRewardInUSD = userAccount.referralRewardsInUSD;
        weeklyRewardInUSD = userAccount.weeklyRewardsInUSD;
        upgradeRewardsInUSD = userAccount.upgradeRewardsInUSD;
        totalRewards =
            referralRewardInUSD +
            weeklyRewardInUSD +
            upgradeRewardsInUSD;
    }

    function getNativePriceInUSD(address _chainLinkOracleAddress) external view returns (uint256) {
        return _priceInUSDWei(_chainLinkOracleAddress);
    }

    function needNativeToRegister(
        address _chainLinkOracleAddress
    ) external view returns (uint256) {
        require(
            _mappingOracle[_chainLinkOracleAddress] == true,
            "Please check the chainLinkOracleAddress or not supported"
        );
        return
            (_registrationValueInUSD * 10 ** 18) /
            _priceInUSDWei(_chainLinkOracleAddress);
    }

    function getSupportedChainLinkOracleAddress()
        external
        view
        returns (address[] memory)
    {
        return _supportedChainLinkOracleAddress;
    }

    function setChainLinkOracleAddress(
        address _chainLinkOracleAddress,
        bool _status
    ) external onlyOwner {
        bool status = _mappingOracle[_chainLinkOracleAddress];
        require(status != _status, "Status already set");
        _mappingOracle[_chainLinkOracleAddress] = _status;

        if (_status == true) {
            _supportedChainLinkOracleAddress.push(_chainLinkOracleAddress);
        } else {
            address[]
                memory chainLinkAddresses = _supportedChainLinkOracleAddress;
            uint256 addressCount = chainLinkAddresses.length;

            for (uint256 i; i < addressCount; ++i) {
                if (chainLinkAddresses[i] == _chainLinkOracleAddress) {
                    _supportedChainLinkOracleAddress[i] = chainLinkAddresses[
                        addressCount - 1
                    ];
                    _supportedChainLinkOracleAddress.pop();
                }
            }
        }
    }

    function checkIfChainLinkOracleAddressSupporeted(
        address _chainLinkOracleAddress
    ) external view returns (bool) {
        return _mappingOracle[_chainLinkOracleAddress];
    }

    function _priceInUSDWei(
        address _chainLinkOracleAddress
    ) private view returns (uint256) {
        AggregatorV3Interface aggregator = AggregatorV3Interface(
            _chainLinkOracleAddress
        );

        return
            _convertToDecimals(
                aggregator.latestAnswer(),
                aggregator.decimals(),
                18
            );
    }

    function _valueToUSD(
        uint256 _valueInWei,
        uint256 _priceInWei
    ) private pure returns (uint256) {
        return (_valueInWei * _priceInWei) / 10 ** 18;
    }

    function _convertToDecimals(
        uint256 _value,
        uint256 _from,
        uint256 _to
    ) private pure returns (uint256) {
        return (_value * 10 ** _to) / 10 ** _from;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}
}
