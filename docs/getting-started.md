---
sidebar_position: 1
---

# Getting Started

Quick start guide for RoboVM development and deployment.

## Prerequisites

### Required Software

- **Node.js** 20.0+ and npm
- **Python** 3.10+
- **Docker** and Docker Compose
- **Git**

### Blockchain Setup

- **MetaMask** or compatible wallet
- **Sepolia testnet** ETH (for gas fees)
- **Hardhat** or Foundry for contract development

### Robotics Setup

- **ROS2 Humble** (Ubuntu 22.04)
- **Gazebo** or **Webots** for simulation
- **Python web3.py** for blockchain integration

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/robovm/robovm.git
cd robovm
```

### 2. Setup Blockchain Contracts

```bash
cd chain
npm install
cp .env.example .env
# Edit .env with your private key and RPC URL
npx hardhat compile
npx hardhat test
```

### 3. Deploy Contracts

```bash
# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia

# Save contract addresses to .env
ROBOX_TOKEN_ADDRESS=0x...
ROBO_TASK_ADDRESS=0x...
REPUTATION_ADDRESS=0x...
```

### 4. Setup Robot Environment

```bash
cd robot
# Create ROS2 workspace
mkdir -p robot_ws/src
cd robot_ws/src

# Clone robot packages
git clone <robot-packages-repo>
cd ..

# Build
colcon build
source install/setup.bash
```

### 5. Configure Robot

```bash
# Edit robot configuration
cp config/robot_config.example.yaml config/robot_config.yaml

# Set your robot's wallet
ROBOT_WALLET_PRIVATE_KEY=0x...
ROBOT_BLOCKCHAIN_ADDRESS=0x...
```

### 6. Start Infrastructure

```bash
cd ops
docker-compose up -d

# This starts:
# - ROS2 container
# - IPFS node
# - Monitoring services
```

### 7. Run Robot

```bash
# In ROS2 workspace
ros2 run robot_agent node
ros2 run task_listener listener
```

## Project Structure

```
RoboVM/
 ├─ chain/           # Solidity contracts, Hardhat, tests
 ├─ robot/           # ROS2 packages
 ├─ ops/              # Docker, Kubernetes, CI/CD
 └─ web/              # Dashboard (React + ethers.js)
```

## First Task

### Create a Task

```javascript
// Using web3.js or ethers.js
const roboTask = new ethers.Contract(
    ROBO_TASK_ADDRESS,
    ROBO_TASK_ABI,
    signer
);

const tx = await roboTask.createTask(
    "Test mapping task",
    ethers.utils.parseEther("10") // 10 RX
);
await tx.wait();
```

### Robot Accepts Task

```python
# Robot automatically detects and accepts
# See robot/task_listener/listener.py
```

### Complete Task

```python
# Robot executes task
result = execute_mapping_task()

# Upload to IPFS
cid = ipfs_client.add_json(result)

# Submit to blockchain
tx = robo_task.functions.submitResult(
    task_id,
    cid
).build_transaction({...})
```

## Next Steps

- [Architecture Overview](/docs/architecture/overview)
- [Smart Contracts](/docs/contracts/robo-task)
- [ROBOX Token](/docs/token/overview)
- [Roadmap](/docs/roadmap)

## Troubleshooting

### Common Issues

**Problem:** Contracts not deploying
- **Solution:** Check RPC URL and private key in `.env`

**Problem:** Robot not connecting to blockchain
- **Solution:** Verify network ID matches Sepolia (11155111)

**Problem:** IPFS not accessible
- **Solution:** Check Docker container is running: `docker ps`

**Problem:** ROS2 nodes not communicating
- **Solution:** Verify ROS2 environment is sourced: `source install/setup.bash`

## Getting Help

- **GitHub Issues:** [github.com/robovm/robovm/issues](https://github.com/robovm/robovm/issues)
- **Discord:** [discord.gg/robovm](https://discord.gg/robovm)
- **Documentation:** This site

---

Ready to dive deeper? Check out the [Architecture Overview](/docs/architecture/overview)!

