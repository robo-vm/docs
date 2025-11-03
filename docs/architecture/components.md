---
sidebar_position: 3
---

# Component Details

Detailed breakdown of RoboVM system components.

## Robot Components

### ROS2 Packages

#### `robot_agent`
Main robot control node that:
- Publishes telemetry (`/robot/status`)
- Listens to commands (`/robot/cmd`)
- Sends periodic heartbeat
- Manages task execution

#### `task_listener`
Blockchain integration node:
- Monitors smart contract events
- Filters relevant tasks
- Calls `acceptTask()` via web3.py
- Handles task lifecycle

#### `nav_module`
Navigation and path planning:
- Waypoint following
- Obstacle avoidance
- Map integration
- Goal-based navigation

### File Structure

```
robot/robot_agent/
 ├─ package.xml
 ├─ setup.py
 └─ robot_agent/
     ├─ node.py        # Status + task execution
     ├─ web3_client.py # Transactions, events
     └─ ipfs_client.py # Add/get CID
```

## Blockchain Components

### Smart Contracts

#### `RoboToken.sol`
BEP-20 token contract:
- Total supply: 1,000,000,000 RVM
- Decimals: 18
- Transfer, approval, minting functions
- Standard BEP-20 interface

#### `RoboTask.sol`
Task management contract:
- `createTask(description, reward)` - Create new mission
- `acceptTask(taskId)` - Robot accepts task
- `placeBid(taskId, price, eta)` - Submit bid
- `submitResult(taskId, resultCid)` - Upload result
- `finalize(taskId)` - Complete and pay

#### `Reputation.sol`
Reputation and staking:
- Track robot performance
- Staking requirements
- Reputation scoring
- Slashing for fraud

### Contract Interactions

```solidity
interface IRoboTask {
  struct Task {
    string desc;
    uint256 reward;
    address creator;
    address assigned;
    bool completed;
    string resultCid;
  }
  
  function createTask(string calldata desc, uint256 reward) 
    external returns (uint256);
  function acceptTask(uint256 id) external;
  function submitResult(uint256 id, string calldata resultCid) external;
  function finalize(uint256 id) external;
}
```

## Infrastructure Components

### Virtual Machine Setup

Each robot runs in a containerized environment:

```yaml
# docker-compose.yml
services:
  ros:
    image: ros:humble-ros-core
    volumes:
      - ../robot:/work
    network_mode: host
    
  ipfs:
    image: ipfs/kubo:latest
    ports:
      - "4001:4001"
      - "5001:5001"
      - "8080:8080"
```

### Components per VM

- **Ubuntu 22.04** - Base OS
- **ROS2 Humble** - Robot framework
- **Python 3.10** - Application code
- **web3.py** - Blockchain client
- **IPFS Node** - Decentralized storage
- **Docker** - Containerization

## Monitoring Components

### Dashboard (React + ethers.js)

- Real-time robot status
- Task queue visualization
- Transaction history
- Network statistics
- Token balance tracker

### Logging & Metrics

- **TimescaleDB/InfluxDB** - Time-series data
- **Grafana** - Visualization
- **ROS2 Logs** - Robot execution logs
- **Blockchain Events** - On-chain activity

## Security Components

### Key Management

- **Docker Secrets** - Private key storage
- **Ansible Vault** - Encrypted configuration
- **Hardware Security Modules** (optional)

### Validation

- **ECDSA Signatures** - Result verification
- **IPFS Hash Verification** - Data integrity
- **Reentrancy Guards** - Smart contract protection

## Integration Points

### ROS2 ↔ Blockchain

```python
from web3 import Web3
w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))
acct = w3.eth.account.from_key(os.getenv("PK"))
robo_task = w3.eth.contract(address=ROBOTASK_ADDR, abi=ROBOTASK_ABI)

def accept_task(task_id):
    tx = robo_task.functions.acceptTask(task_id).build_transaction({
        "from": acct.address,
        "nonce": w3.eth.get_transaction_count(acct.address)
    })
    signed = acct.sign_transaction(tx)
    w3.eth.send_raw_transaction(signed.rawTransaction)
```

### Blockchain ↔ IPFS

```python
from ipfshttpclient import connect

def upload_result(data):
    client = connect('/ip4/127.0.0.1/tcp/5001')
    result = client.add_json(data)
    return result['Hash']  # CID
```

---

Next: [Blockchain Overview](/docs/blockchain/overview)

