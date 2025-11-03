---
sidebar_position: 1
---

# RoboVM Token (RVM) Overview

RoboVM (RVM) is the native BEP-20 token that powers the RoboVM ecosystem.

## Token Specifications

| Parameter | Value |
|-----------|-------|
| **Name** | RoboVM |
| **Symbol** | RVM |
| **Type** | BEP-20 |
| **Total Supply** | 1,000,000,000 RVM |
| **Decimals** | 18 |
| **Network** | Binance Smart Chain (BSC) |

## Token Functions

### 1. Payment for Resources

A robot pays another robot for access to data:
- Updated maps
- GPS coordinates
- Sensor readings
- Historical data

**Example:**
```solidity
// Robot B pays Robot A for map data
roboToken.transfer(robotA, 5 * 10**18); // 5 RVM
```

### 2. Rewards for Completed Tasks

Smart contract automatically releases tokens to robot that completes a mission.

**Example:**
```solidity
// Task reward: 100 RVM
// Upon completion:
roboToken.transfer(robotAddress, 100 * 10**18);
```

### 3. Reputation System

Robots can "stake" tokens to prove trustworthiness in their decisions:
- Higher stake = higher trust
- Fraudulent behavior = stake slashing
- Good performance = stake returned + bonus

### 4. Governance

Token holders can vote on:
- Protocol updates
- Resource allocation
- Parameter changes
- Feature additions

## Tokenomics

### Distribution

**Note:** The final tokenomics and distribution strategy have not yet been determined. The allocation percentages and distribution mechanisms are still under development.

Total Supply: 1,000,000,000 RVM

### Reward Mechanism

**Task Completion:**
- Standard task: 10-100 RVM
- Complex task: 100-1000 RVM
- Emergency task: 500-5000 RVM

**Staking Rewards:**
- Staked tokens earn interest: 5% APR
- Paid in RVM tokens

**Reputation Bonuses:**
- High reputation robots: +10% reward multiplier
- Consistent performance: +5% bonus

## Use Cases

### For Robot Owners

- **Earn tokens** by completing tasks
- **Build reputation** through consistent performance
- **Participate in governance** by holding tokens

### For Task Creators

- **Pay robots** for services
- **Incentivize** specific missions
- **Access robot network** capabilities

### For the Network

- **Decentralized coordination** without central authority
- **Incentivized participation** attracts more robots
- **Self-sustaining economy** through token circulation

## Token Flow Example

```
1. Creator funds task: 100 RVM
   └─> Locked in smart contract

2. Robot A completes task
   └─> Receives 100 RVM

3. Robot A pays Robot B for map data: 10 RVM
   └─> Robot B receives 10 RVM

4. Robot B stakes 50 RVM for reputation
   └─> Locked, earns interest

5. Robot B completes high-value task
   └─> Receives 200 RVM (with reputation bonus)
```

## Integration with Smart Contracts

### Transfer Function

```solidity
// Standard ERC-20 transfer
function transfer(address to, uint256 amount) 
    public returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
}
```

### Approval for Contracts

```solidity
// Allow RoboTask contract to spend tokens
roboToken.approve(roboTaskAddress, 1000 * 10**18);

// Contract can now transfer on your behalf
roboTask.createTask("Mission", 100 * 10**18);
```

## Security Considerations

- **Standard BEP-20** - Well-audited implementation (ERC-20 compatible)
- **OpenZeppelin** - Industry-standard library
- **Access controls** - Minting restricted
- **Reentrancy protection** - Safe transfers

---

Next: [Tokenomics](/docs/token/tokenomics) or [Smart Contract](/docs/token/smart-contract)

