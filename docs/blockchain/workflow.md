---
sidebar_position: 3
---

# Blockchain Workflow

Step-by-step workflow for task execution on the blockchain.

## Complete Task Lifecycle

### Phase 1: Task Creation

```solidity
// Creator calls
createTask("Map building floor 3", 100 * 10**18); // 100 RVM
```

**What happens:**
1. Contract validates input
2. Creates new `Task` struct
3. Emits `TaskCreated` event
4. Returns task ID

**Gas cost:** ~50,000 gas

### Phase 2: Robot Discovery

```python
# Robot listens for events
event_filter = contract.events.TaskCreated.create_filter(fromBlock='latest')

for event in event_filter.get_new_entries():
    task_id = event['args']['taskId']
    description = event['args']['description']
    reward = event['args']['reward']
    
    # Evaluate task
    if can_handle_task(description):
        bid_on_task(task_id, reward)
```

### Phase 3: Bidding

```python
# Robot calculates bid
cost = calculate_task_cost(description)  # 80 RVM
eta = estimate_completion_time()  # 300 seconds

# Submit bid
tx = contract.functions.placeBid(
    task_id,
    cost,
    eta
).build_transaction({...})
```

**Bid Structure:**
- Price (RVM tokens)
- Estimated time (seconds)
- Robot reputation (from Reputation contract)
- Current stake (if required)

### Phase 4: Task Assignment

```solidity
// Contract or creator selects best bid
function assignBestBid(uint256 taskId) external {
    Bid memory bestBid = findBestBid(taskId);
    tasks[taskId].assigned = bestBid.robot;
    emit TaskAccepted(taskId, bestBid.robot);
}
```

**Selection criteria:**
- Lowest price (with reputation weighting)
- Fastest completion time
- Highest reputation
- Sufficient stake

### Phase 5: Execution

**Off-chain:** Robot performs task
- Navigates to location
- Collects data
- Processes information
- Generates result

**On-chain:** Status updates (optional)
```python
# Periodic status update
contract.functions.updateTaskStatus(task_id, "in_progress").transact({...})
```

### Phase 6: Result Submission

```python
# 1. Upload result to IPFS
result_data = {
    "taskId": task_id,
    "robot": robot_address,
    "map": map_data,
    "timestamp": current_time,
    "metrics": {...}
}
ipfs_cid = ipfs_client.add_json(result_data)

# 2. Submit CID to blockchain
tx = contract.functions.submitResult(
    task_id,
    ipfs_cid
).build_transaction({...})
```

### Phase 7: Verification

```python
# Creator or auditor verifies
def verify_result(task_id, ipfs_cid):
    # Fetch result from IPFS
    result = ipfs_client.get_json(ipfs_cid)
    
    # Validate result
    if validate_result(result):
        # Approve on-chain
        contract.functions.approveResult(task_id).transact({...})
    else:
        # Dispute
        contract.functions.disputeResult(task_id, reason).transact({...})
```

### Phase 8: Finalization

```solidity
function finalize(uint256 taskId) external {
    Task storage task = tasks[taskId];
    require(task.completed, "Task not completed");
    require(task.verified, "Result not verified");
    
    // Transfer reward
    roboToken.transfer(task.assigned, task.reward);
    
    // Update reputation
    reputation.incrementReputation(task.assigned);
    
    emit TaskFinalized(taskId);
}
```

## Error Handling

### Failed Execution

If robot fails to complete:
1. Timeout mechanism (e.g., 1 hour)
2. Task reassigned to next bidder
3. Staked tokens may be slashed (if applicable)

### Disputed Results

If result is disputed:
1. Second robot audits (paid small fee)
2. If fraud confirmed: stake slashed, reputation decreased
3. If valid: auditor rewarded, original robot paid

## Multi-Robot Coordination

### Scenario: Multiple Robots, One Task

```
Task: "Patrol area X"
├─ Robot A bids: 50 RVM, 10 min
├─ Robot B bids: 45 RVM, 15 min
├─ Robot C bids: 60 RVM, 8 min
│
└─ Winner: Robot B (best price/quality ratio)
```

### Scenario: Collaborative Task

```
Task: "Map large building"
├─ Robot A: Floor 1 (assigned via sub-task)
├─ Robot B: Floor 2 (assigned via sub-task)
├─ Robot C: Floor 3 (assigned via sub-task)
│
└─ Results merged off-chain, uploaded as one
```

## Gas Optimization Tips

1. **Batch operations** - Combine multiple actions
2. **Use events** - For off-chain updates
3. **Optimize storage** - Store hashes, not full data
4. **Layer 2** - Use BSC/Arbitrum for lower costs
5. **State channels** - For frequent micro-payments

---

Next: [RoboVM Token](/docs/token/overview)

