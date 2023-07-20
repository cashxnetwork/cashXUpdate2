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

    mapping(address => AccountStruct) private mappingAccounts;
    mapping(uint8 => UpgradeStruct) private _mappingUpgrade;

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

    event WeeklyRewardsPaid(address to, uint256 valueInWei);

    event TeamWalletRewardPaid(address to, uint256 valueInWei);

    event AddedToRandomList(address user);
    event RemovedFromRandomList(address user);

    receive() external payable {}

    uint256 private _nativePriceInUSD;

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

        _nativePriceInUSD = 250 * 10 ** 18; //Replace chainlink in production

        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function setDefaults() external onlyOwner {
        mappingAccounts[_defaultReferrer].self = _defaultReferrer;
        mappingAccounts[_defaultReferrer].parent = _defaultReferrer;
        _randomUserList.push(_defaultReferrer);
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
        AccountStruct storage userAccount = mappingAccounts[_referee];
        require(_referrer != _referee, "You cannot refer yourself.");

        AccountStruct storage referrerAccount;

        if (_referrer == address(0)) {
            referrerAccount = mappingAccounts[_defaultReferrer];
        } else {
            referrerAccount = mappingAccounts[_referrer];
        }

        if (!_isRefereeLimitReached(referrerAccount)) {
            _addUpline(referrerAccount, userAccount);

            referrerAccount.referee.push(_referee);

            if (_isRefereeLimitReached(referrerAccount)) {
                _removeFromRandomList(referrerAccount);
            }
        } else {
            AccountStruct storage randomAccount = mappingAccounts[
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

            referrerAccount = mappingAccounts[userAccount.referrer];
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
        uint256 _msgValueInUSD, // uint256 _msgValue
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

        AccountStruct storage userAccount = mappingAccounts[_referee];
        AccountStruct storage referrerAccount = mappingAccounts[_referrer];

        require(userAccount.selfBusinessInUSD == 0, "User already registered");

        if (userAccount.self == address(0)) {
            userAccount.self = _referee;
        }

        if (referrerAccount.self == address(0)) {
            referrerAccount.self = _referrer;
        }

        if (userAccount.selfBusinessInUSD == 0) {
            _users.push(_referee);
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
        AccountStruct storage parentAccount = mappingAccounts[
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

            referrerAccount = mappingAccounts[userAccount.referrer];

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

    function registrationNative(address _referrer) external payable {
        uint256 msgValue = msg.value;
        uint256 priceInUSD = _priceInUSD();
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
        AccountStruct storage userAccount = mappingAccounts[_userAddress];
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

            AccountStruct storage referrerAccount = mappingAccounts[
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

    function upgradeAccountNative() external payable {
        uint256 msgValue = msg.value;
        uint256 msgValueInUSD = _valueToUSD(msgValue, _priceInUSD());
        _upgradeIdNative(msgValue, msgValueInUSD, msg.sender);
    }

    function getUserCurrentUpgradeLevel(
        address _userAddress
    ) external view returns (uint8 level, uint256 totalUpgradeValueInUSD) {
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
        if (userAccount.upgradeId > 0) {
            level = userAccount.upgradeId;
        }

        totalUpgradeValueInUSD = userAccount.upgradedValueInUSD;
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

    //Weekly Rewards Function
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

    function distributeWeeklyReward() external {
        uint256 weeklyRewardValueInWei = _weeklyRewardValueInWei;
        uint256 weeklyRewardValueInUSD = _valueToUSD(
            weeklyRewardValueInWei,
            _priceInUSD()
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
        AccountStruct storage globalAddressAccount = mappingAccounts[
            globalAddress
        ];

        globalAddressAccount.weeklyRewardsInUSD += weeklyRewardValueInUSD;

        payable(globalAddress).transfer(weeklyRewardValueInWei);

        delete _weeklyRewardValueInWei;
        _weeklyRewardTimestamp = block.timestamp;
        _weeklyRewardsPaidInUSD += weeklyRewardValueInUSD;
        emit WeeklyRewardsPaid(globalAddress, weeklyRewardValueInUSD);
    }

    function getUserAccount(
        address _userAddress
    ) external view returns (AccountStruct memory) {
        return mappingAccounts[_userAddress];
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
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
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
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
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
            uint256 upgradeRewardsInUSD
        )
    {
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
        referralRewardInUSD = userAccount.referralRewardsInUSD;
        weeklyRewardInUSD = userAccount.weeklyRewardsInUSD;
        upgradeRewardsInUSD = userAccount.upgradeRewardsInUSD;
    }

    function getNativePriceInUSD() external view returns (uint256) {
        return _nativePriceInUSD;
    }

    function needNativeToRegister() external view returns (uint256) {
        return _registrationValueInUSD / _priceInUSD();
    }

    function _priceInUSD() private view returns (uint256) {
        return _nativePriceInUSD;
    }

    function _valueToUSD(
        uint256 _valueInWei,
        uint256 _priceInWei
    ) private pure returns (uint256) {
        return (_valueInWei * _priceInWei) / 10 ** 18;
    }

    function _toTokenDecimals(
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
