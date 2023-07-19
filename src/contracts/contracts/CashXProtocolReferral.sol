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
    uint256 valueToUpgrade;
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
    uint256 selfBusiness;
    uint256 upgradedValue;
    uint8 upgradeId;
    uint256 directBusiness;
    uint256 teamBusiness;
    uint256 referralRewards;
    uint256 weeklyRewards;
    uint256 upgradeRewards;
    uint256 userRandomIndex;
}

contract CashXProtocolReferral is
    Initializable,
    OwnableUpgradeable,
    UUPSUpgradeable
{
    address[] private _users;
    address[] private _randomUserList;

    uint256 private _registrationValueTotal;
    uint256 private _referralPaid;
    uint256 private _randomRewardsPaid;
    uint256 private _weeklyRewardsPaid;
    uint256 private _valueLiquidityCreated;

    address private _teamWallet;
    uint8 private _teamWalletRate;

    uint256 private _valueToCreateLiquidity;
    uint8 private _liquidityCreateRate;

    uint256 private _weeklyRewardValue;
    uint8 private _weeklyRewardRate;
    uint256 private _weeklyRewardTimestamp;

    uint8[] private _levelRates;
    uint8 private _levelsToCount;
    uint256 private _refereeLimit;

    address private _defaultReferrer;
    uint256 private _registrationValue;

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

    function initialize() public initializer {
        _defaultReferrer = 0xeb1100091Ce830ba58A04834c35D29B75b53eb74; //Need to change
        // mappingAccounts[_defaultReferrer].self = _defaultReferrer;
        // mappingAccounts[_defaultReferrer].parent = _defaultReferrer;
        // _randomUserList[0] = _defaultReferrer;
        _registrationValue = 100000000000000000;

        _levelRates = [60];
        _levelsToCount = 10;
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
        mappingAccounts[_defaultReferrer].self = _defaultReferrer;
        mappingAccounts[_defaultReferrer].parent = _defaultReferrer;
        _randomUserList[0] = _defaultReferrer;
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
    ) private view returns (bool _reached) {
        if (_userAccount.referee.length >= _refereeLimit) {
            _reached = true;
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

    function _removeFromRandomList(AccountStruct memory _userAccount) private {
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
        if (_userAccount.parent == address(0)) {
            _userAccount.parent = _referrerAccount.parent;
        }

        _userAccount.referrer = _referrerAccount.self;
        emit ReferrerAdded(_referrerAccount.self, _userAccount.self);
    }

    function _addReferrer(address _referrer, address _referee) private {
        AccountStruct storage userAccount = mappingAccounts[_referee];
        require(_referrer != _referee, "You cannot refer yourself.");

        if (!_hasReferrer(userAccount)) {
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

                randomAccount.referee.push(_referee);
            }

            if (userAccount.userRandomIndex == 0) {
                _addToRandomList(userAccount);
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
        } else {
            emit ReferrerNoAdded("User Already have referrer set.");
        }
    }

    function _registrationNative(
        address _referrer,
        address _referee,
        uint256 _msgValue
    ) private {
        uint256 registrationValue = _registrationValue;
        require(
            _msgValue >= registrationValue,
            "Value is less then registration value."
        );

        uint8[] memory levelRates = _levelRates;
        uint8 levelsToCount = _levelsToCount;
        uint256 totalReferralPaid;

        AccountStruct storage userAccount = mappingAccounts[_referee];
        AccountStruct storage referrerAccount = mappingAccounts[_referrer];

        if (referrerAccount.self == address(0)) {
            referrerAccount.self = _referrer;
        }

        if (userAccount.self == address(0)) {
            userAccount.self = _referee;
        }

        if (userAccount.selfBusiness == 0) {
            _users.push(userAccount.self);
        }

        uint256 userSelfBusiness = userAccount.selfBusiness;

        userAccount.selfBusiness += _msgValue;

        _addReferrer(_referrer, _referee);

        emit Registration(
            userAccount.parent,
            userAccount.referrer,
            userAccount.self,
            _msgValue
        );

        uint256 referralValue = (_msgValue * levelRates[0]) / 100;
        if (userSelfBusiness == 0) {
            AccountStruct storage parentAccount = mappingAccounts[
                userAccount.parent
            ];
            if (parentAccount.self != address(0)) {
                payable(parentAccount.self).transfer(referralValue);
                emit ReferralRewardsPaid(
                    parentAccount.self,
                    _referee,
                    referralValue,
                    1
                );
                parentAccount.referralRewards += referralValue;
            }
        } else {
            payable(referrerAccount.self).transfer(referralValue);
            emit ReferralRewardsPaid(
                userAccount.referrer,
                _referee,
                referralValue,
                1
            );

            referrerAccount.referralRewards += referralValue;
        }

        totalReferralPaid += referralValue;
        for (uint8 i; i < levelsToCount; i++) {
            if (!_hasReferrer(userAccount)) {
                break;
            }

            referrerAccount = mappingAccounts[userAccount.referrer];

            if (i == 0) {
                referrerAccount.directBusiness += _msgValue;
            }

            referrerAccount.teamBusiness += _msgValue;

            userAccount = referrerAccount;
        }

        uint256 teamValue = (_msgValue * _teamWalletRate) / 100;
        payable(_teamWallet).transfer(teamValue);
        emit TeamWalletRewardPaid(_teamWallet, teamValue);

        _referralPaid += totalReferralPaid;
        _registrationValueTotal += _msgValue;

        uint256 liquidityValue = (_msgValue * _liquidityCreateRate) / 100;
        payable(_liquidityWallet).transfer(liquidityValue);
        _valueToCreateLiquidity += liquidityValue;

        _weeklyRewardValue += (_msgValue * _weeklyRewardRate) / 100;
    }

    function registrationNative(address _referrer) external payable {
        _registrationNative(_referrer, msg.sender, msg.value);
    }

    function _upgradeId(
        uint8 _id,
        uint256 _msgValue,
        address _userAddress
    ) private {
        UpgradeStruct memory ugradeIdAccount = _mappingUpgrade[_id];
        require(
            ugradeIdAccount.valueToUpgrade > 0,
            "Upgrade value cannot be 0."
        );
        require(
            _msgValue >= ugradeIdAccount.valueToUpgrade,
            "Value should be equal to upgrade value"
        );

        AccountStruct storage userAccount = mappingAccounts[_userAddress];
        require(
            _id == userAccount.upgradeId,
            "You cannot degrade of jump to another upgrade level."
        );

        userAccount.upgradedValue += _msgValue;
        userAccount.upgradeId++;

        for (uint i; i < _id + 1; ++i) {
            if (userAccount.referrer == address(0)) {
                break;
            }

            AccountStruct storage referrerAccount = mappingAccounts[
                userAccount.referrer
            ];

            if (i == _id) {
                if (referrerAccount.upgradeId >= _id) {
                    referrerAccount.upgradeRewards += _msgValue;
                    payable(referrerAccount.self).transfer(_msgValue);
                    emit UpgradeRewardPaid(
                        referrerAccount.self,
                        _userAddress,
                        _msgValue
                    );
                } else {
                    emit UpgradeRewardNotPaid(
                        "User has not upgraded. Amount transfered to liquidity wallet."
                    );
                    address liquidityWallet = _liquidityWallet;
                    payable(liquidityWallet).transfer(_msgValue);
                    emit UpgradeRewardPaid(
                        liquidityWallet,
                        _userAddress,
                        _msgValue
                    );
                }
            }

            userAccount = referrerAccount;
        }
    }

    function getRegistrationsStats()
        external
        view
        returns (
            uint32 totalUser,
            uint256 totalRegistrationValue,
            uint256 totalReferralPaid,
            uint256 totalWeeklyRewardsPaid
        )
    {
        totalUser = uint32(_users.length);
        totalRegistrationValue = _registrationValueTotal;
        totalReferralPaid = _referralPaid;
        totalWeeklyRewardsPaid = _weeklyRewardsPaid;
    }

    //Weekly Rewards Function
    function getWeeklyRewardToBeDistributed()
        external
        view
        returns (uint256 _rewardValue, uint256 _remianingTime, uint256 _endTime)
    {
        _rewardValue = _weeklyRewardValue;
        _endTime = _weeklyRewardTimestamp + 7 days;
        uint256 _currentTime = block.timestamp;
        if (_endTime > _currentTime) {
            _remianingTime = _endTime - _currentTime;
        }
    }

    function distributeWeeklyReward() external {
        uint256 weeklyRewardValue = _weeklyRewardValue;
        uint256 weeklyCounterEndTime = _weeklyRewardTimestamp + 7 days;
        uint256 _currentTime = block.timestamp;
        require(
            _currentTime >= weeklyCounterEndTime,
            "Weekly time is not over yet."
        );

        require(weeklyRewardValue > 0, "No rewards to distribute");

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

        if (weeklyRewardValue > 0) {
            globalAddressAccount.weeklyRewards += weeklyRewardValue;

            payable(globalAddress).transfer(weeklyRewardValue);

            _weeklyRewardValue = 0;
            _weeklyRewardTimestamp = block.timestamp;
            _weeklyRewardsPaid += weeklyRewardValue;
            emit WeeklyRewardsPaid(globalAddress, weeklyRewardValue);
        }
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
            uint256 selfBusiness,
            uint256 directBusiness,
            uint256 teamBusiness,
            uint256 totalBusiness
        )
    {
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
        selfBusiness = userAccount.selfBusiness;
        directBusiness = userAccount.directBusiness;
        teamBusiness = userAccount.teamBusiness;
        totalBusiness = userAccount.teamBusiness + userAccount.selfBusiness;
    }

    function getUserRewards(
        address _userAddress
    )
        external
        view
        returns (
            uint256 referralReward,
            uint256 weeklyReward,
            uint256 upgradeRewards
        )
    {
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
        referralReward = userAccount.referralRewards;
        weeklyReward = userAccount.weeklyRewards;
        upgradeRewards = userAccount.upgradeRewards;
    }

    function getUserCurrentUpgradeLevel(
        address _userAddress
    ) external view returns (uint8 currentUpgradeId, uint256 upgradedValue) {
        AccountStruct memory userAccount = mappingAccounts[_userAddress];
        currentUpgradeId = userAccount.upgradeId;
        upgradedValue = userAccount.upgradedValue;
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
