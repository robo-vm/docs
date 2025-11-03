---
sidebar_position: 2
---

# Blockchain Architecture

Detailed architecture of the blockchain layer in RoboVM.

## Contract Structure

### Layer 1: Token Layer

**RoboToken.sol** - Base ERC-20 token
- Standard token functionality
- Minting and burning
- Transfer restrictions (optional)

### Layer 2: Task Layer

**RoboTask.sol** - Task management
- Task lifecycle management
- Bidding mechanism
- Result verification
- Reward distribution

### Layer 3: Reputation Layer

**Reputation.sol** - Reputation and staking
- Performance tracking
- Staking requirements
- Reputation scoring
- Penalty system

## Data Flow

```
User/Robot
    │
    ├─> createTask() ──> RoboTask Contract
    │                        │
    │                        ├─> Emit TaskCreated Event
    │                        │
    │                        └─> Store in mapping
    │
    ├─> placeBid() ──> RoboTask Contract
    │                      │
    │                      ├─> Validate bid
    │                      ├─> Store bid
    │                      └─> Emit BidPlaced Event
    │
    └─> finalize() ──> RoboTask Contract
                           │
                           ├─> Verify result
                           ├─> Transfer RX from RoboToken
                           └─> Update Reputation
```

## Event System

### Task Events

```solidity
event TaskCreated(
    uint256 indexed taskId,
    string description,
    uint256 reward,
    address creator
);

event TaskAccepted(
    uint256 indexed taskId,
    address indexed robot
);

event TaskCompleted(
    uint256 indexed taskId,
    string resultCid
);
```

### Listening to Events

```javascript
// Web3.js
contract.on('TaskCreated', (taskId, description, reward, creator) => {
  console.log(`New task: ${taskId} - ${description}`);
  // Robot logic to evaluate and bid
});

// web3.py
event_filter = contract.events.TaskCreated.create_filter(
    fromBlock='latest'
)
for event in event_filter.get_new_entries():
    handle_new_task(event)
```

## State Management

### On-Chain State

- Task registry
- Bid history
- Robot assignments
- Reputation scores
- Token balances

### Off-Chain State (IPFS)

- Large result files
- Detailed logs
- Sensor data
- Maps and images

## Integration Points

### Robot → Blockchain

```python
# Robot accepts task
def accept_task(task_id):
    tx = robo_task.functions.acceptTask(task_id).build_transaction({
        "from": robot_address,
        "nonce": w3.eth.get_transaction_count(robot_address),
        "gas": 100000
    })
    signed = robot_account.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    return w3.eth.wait_for_transaction_receipt(tx_hash)
```

### Blockchain → IPFS

```python
# Upload result and submit CID
def complete_task(task_id, result_data):
    # Upload to IPFS
    ipfs_cid = ipfs_client.add_json(result_data)
    
    # Submit CID to blockchain
    tx = robo_task.functions.submitResult(
        task_id, 
        ipfs_cid
    ).build_transaction({...})
    # ... send transaction
```

## Scalability Solutions

### Layer 2 Options

- **Polygon** - Sidechain with Ethereum compatibility
- **Arbitrum** - Optimistic rollup
- **Optimism** - Optimistic rollup
- **State Channels** - For frequent micro-payments

### Off-Chain Computation

- Computation-heavy tasks run off-chain
- Only results and verification on-chain
- Reduces gas costs significantly

## Security Architecture

### Access Control

```solidity
modifier onlyRobot() {
    require(reputation.hasMinimumReputation(msg.sender), "Low reputation");
    require(reputation.hasStake(msg.sender), "No stake");
    _;
}
```

### Verification Flow

1. Robot submits result with IPFS CID
2. Smart contract stores CID
3. Creator or auditor verifies off-chain
4. Verification triggers on-chain finalization
5. Rewards distributed

---

Next: [Workflow Details](/docs/blockchain/workflow)

