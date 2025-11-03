---
sidebar_position: 2
---

# Reputation Smart Contract

Manages robot reputation scores and staking mechanisms.

## Contract Overview

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Reputation {
    struct RobotReputation {
        uint256 score;
        uint256 stakedAmount;
        uint256 tasksCompleted;
        uint256 tasksFailed;
        uint256 disputes;
    }
    
    mapping(address => RobotReputation) public reputations;
    
    uint256 public constant MIN_REPUTATION = 100;
    uint256 public constant REPUTATION_INCREMENT = 10;
    uint256 public constant REPUTATION_PENALTY = 50;
}
```

## Core Functions

### Get Reputation

```solidity
function getReputation(address robot) 
    public 
    view 
    returns (uint256) 
{
    return reputations[robot].score;
}
```

### Increment Reputation

```solidity
function incrementReputation(address robot) external {
    require(
        msg.sender == roboTaskAddress,
        "Only RoboTask can update"
    );
    
    reputations[robot].score += REPUTATION_INCREMENT;
    reputations[robot].tasksCompleted++;
    
    emit ReputationUpdated(robot, reputations[robot].score);
}
```

### Decrement Reputation

```solidity
function decrementReputation(address robot) external {
    require(
        msg.sender == roboTaskAddress,
        "Only RoboTask can update"
    );
    
    if (reputations[robot].score > REPUTATION_PENALTY) {
        reputations[robot].score -= REPUTATION_PENALTY;
    } else {
        reputations[robot].score = 0;
    }
    
    reputations[robot].tasksFailed++;
    
    emit ReputationUpdated(robot, reputations[robot].score);
}
```

## Staking Functions

### Stake Tokens

```solidity
function stake(uint256 amount) external {
    require(amount > 0, "Amount must be > 0");
    
    // Transfer tokens to contract
    roboToken.transferFrom(msg.sender, address(this), amount);
    
    // Update staked amount
    reputations[msg.sender].stakedAmount += amount;
    
    emit Staked(msg.sender, amount);
}
```

### Unstake Tokens

```solidity
function unstake(uint256 amount) external {
    require(
        reputations[msg.sender].stakedAmount >= amount,
        "Insufficient stake"
    );
    
    // Check cooldown period (e.g., 7 days)
    require(
        block.timestamp >= lastStakeTime[msg.sender] + COOLDOWN_PERIOD,
        "Cooldown period not passed"
    );
    
    reputations[msg.sender].stakedAmount -= amount;
    roboToken.transfer(msg.sender, amount);
    
    emit Unstaked(msg.sender, amount);
}
```

### Slash Stake

```solidity
function slashStake(address robot, uint256 amount) external {
    require(
        msg.sender == roboTaskAddress,
        "Only RoboTask can slash"
    );
    
    uint256 staked = reputations[robot].stakedAmount;
    uint256 slashAmount = amount > staked ? staked : amount;
    
    reputations[robot].stakedAmount -= slashAmount;
    
    // Burn or send to treasury
    roboToken.transfer(treasuryAddress, slashAmount);
    
    emit StakeSlashed(robot, slashAmount);
}
```

## Reputation Levels

```solidity
enum ReputationLevel {
    New,        // 0-99
    Beginner,   // 100-499
    Intermediate, // 500-999
    Advanced,   // 1000-4999
    Expert      // 5000+
}

function getReputationLevel(address robot) 
    public 
    view 
    returns (ReputationLevel) 
{
    uint256 score = reputations[robot].score;
    
    if (score < 100) return ReputationLevel.New;
    if (score < 500) return ReputationLevel.Beginner;
    if (score < 1000) return ReputationLevel.Intermediate;
    if (score < 5000) return ReputationLevel.Advanced;
    return ReputationLevel.Expert;
}
```

## Events

```solidity
event ReputationUpdated(
    address indexed robot,
    uint256 newScore
);

event Staked(
    address indexed robot,
    uint256 amount
);

event Unstaked(
    address indexed robot,
    uint256 amount
);

event StakeSlashed(
    address indexed robot,
    uint256 amount
);
```

## Integration with RoboTask

```solidity
// In RoboTask contract
contract RoboTask {
    Reputation public reputation;
    
    function acceptTask(uint256 _id) public {
        require(
            reputation.getReputation(msg.sender) >= 
            tasks[_id].reputationReq,
            "Insufficient reputation"
        );
        // ... rest of logic
    }
    
    function finalize(uint256 _id) public {
        // ... complete task
        reputation.incrementReputation(tasks[_id].assigned);
    }
}
```

## Reputation Calculation

### Formula

```
Reputation Score = Base Score + (Tasks Completed × 10) - (Tasks Failed × 50)
                 + (Stake Bonus) - (Disputes × 20)

Stake Bonus = min(Staked Amount / 1000, 100)
```

### Example

```
Robot A:
- Tasks Completed: 50
- Tasks Failed: 2
- Staked: 5,000 RVM
- Disputes: 0

Score = 0 + (50 × 10) - (2 × 50) + 100 - 0
      = 500 - 100 + 100
      = 500 (Intermediate level)
```

---

Next: [RoboVM Token](/docs/token/overview) or [Getting Started](/docs/getting-started)

