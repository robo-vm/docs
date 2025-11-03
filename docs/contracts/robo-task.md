---
sidebar_position: 1
---

# RoboTask Smart Contract

The core smart contract for managing robot tasks in the RoboVM network.

## Contract Overview

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RoboTask {
    struct Task {
        string description;
        uint256 reward;
        address creator;
        address assigned;
        bool completed;
        string resultCid;  // IPFS CID
        uint256 minStake;
        uint256 reputationReq;
    }
    
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    
    // ... implementation
}
```

## Core Functions

### Create Task

```solidity
function createTask(
    string memory _desc,
    uint256 _reward
) public returns (uint256) {
    taskCount++;
    tasks[taskCount] = Task({
        description: _desc,
        reward: _reward,
        creator: msg.sender,
        assigned: address(0),
        completed: false,
        resultCid: "",
        minStake: 0,
        reputationReq: 0
    });
    
    emit TaskCreated(taskCount, _desc, _reward, msg.sender);
    return taskCount;
}
```

**Usage:**
```javascript
await roboTask.createTask(
    "Map building floor 3",
    web3.utils.toWei("100", "ether"), // 100 RX
    { from: creatorAddress }
);
```

### Accept Task

```solidity
function acceptTask(uint256 _id) public {
    require(tasks[_id].assigned == address(0), "Already assigned");
    require(
        reputation.getReputation(msg.sender) >= tasks[_id].reputationReq,
        "Insufficient reputation"
    );
    
    tasks[_id].assigned = msg.sender;
    emit TaskAccepted(_id, msg.sender);
}
```

### Submit Result

```solidity
function submitResult(
    uint256 _id,
    string memory _resultCid
) public {
    require(msg.sender == tasks[_id].assigned, "Not your task");
    require(!tasks[_id].completed, "Already completed");
    
    tasks[_id].resultCid = _resultCid;
    tasks[_id].completed = true;
    
    emit TaskCompleted(_id, _resultCid);
}
```

### Finalize Task

```solidity
function finalize(uint256 _id) public {
    require(tasks[_id].completed, "Task not completed");
    require(msg.sender == tasks[_id].creator, "Only creator can finalize");
    
    // Transfer reward
    roboToken.transfer(
        tasks[_id].assigned,
        tasks[_id].reward
    );
    
    // Update reputation
    reputation.incrementReputation(tasks[_id].assigned);
    
    emit TaskFinalized(_id);
}
```

## Bidding Mechanism

### Place Bid

```solidity
struct Bid {
    address robot;
    uint256 price;
    uint256 eta;  // Estimated time in seconds
    uint256 timestamp;
}

mapping(uint256 => Bid[]) public bids;

function placeBid(
    uint256 _taskId,
    uint256 _price,
    uint256 _eta
) public {
    require(_price > 0, "Price must be > 0");
    
    bids[_taskId].push(Bid({
        robot: msg.sender,
        price: _price,
        eta: _eta,
        timestamp: block.timestamp
    }));
    
    emit BidPlaced(_taskId, msg.sender, _price, _eta);
}
```

### Select Best Bid

```solidity
function assignBestBid(uint256 _taskId) external {
    Bid[] storage taskBids = bids[_taskId];
    require(taskBids.length > 0, "No bids");
    
    uint256 bestIndex = 0;
    uint256 bestScore = calculateScore(taskBids[0]);
    
    for (uint256 i = 1; i < taskBids.length; i++) {
        uint256 score = calculateScore(taskBids[i]);
        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }
    
    tasks[_taskId].assigned = taskBids[bestIndex].robot;
    emit TaskAccepted(_taskId, taskBids[bestIndex].robot);
}

function calculateScore(Bid memory bid) internal view returns (uint256) {
    uint256 rep = reputation.getReputation(bid.robot);
    // Score = reputation * (1 / price) * (1 / eta)
    return (rep * 1e18) / (bid.price * bid.eta);
}
```

## Events

```solidity
event TaskCreated(
    uint256 indexed taskId,
    string description,
    uint256 reward,
    address creator
);

event BidPlaced(
    uint256 indexed taskId,
    address indexed robot,
    uint256 price,
    uint256 eta
);

event TaskAccepted(
    uint256 indexed taskId,
    address indexed robot
);

event TaskCompleted(
    uint256 indexed taskId,
    string resultCid
);

event TaskFinalized(uint256 indexed taskId);
```

## Security Features

### Access Control

```solidity
modifier onlyCreator(uint256 _taskId) {
    require(msg.sender == tasks[_taskId].creator, "Only creator");
    _;
}

modifier onlyAssigned(uint256 _taskId) {
    require(msg.sender == tasks[_taskId].assigned, "Not assigned");
    _;
}
```

### Reentrancy Protection

```solidity
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RoboTask is ReentrancyGuard {
    function finalize(uint256 _id) 
        public 
        nonReentrant 
    {
        // ... implementation
    }
}
```

## Integration Example

```python
from web3 import Web3

# Initialize
w3 = Web3(Web3.HTTPProvider(RPC_URL))
robo_task = w3.eth.contract(
    address=ROBOTASK_ADDRESS,
    abi=ROBOTASK_ABI
)

# Create task
tx = robo_task.functions.createTask(
    "Map area X",
    Web3.toWei(100, 'ether')
).build_transaction({
    "from": creator_address,
    "nonce": w3.eth.get_transaction_count(creator_address)
})

# Listen for events
event_filter = robo_task.events.TaskCreated.create_filter(
    fromBlock='latest'
)
```

---

Next: [Reputation Contract](/docs/contracts/reputation) or [Testing](/docs/contracts/tests)

