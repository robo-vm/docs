---
sidebar_position: 1
---

# Architecture Overview

RoboVM follows a three-layer architecture that enables decentralized robot coordination through blockchain technology.

## System Architecture

```
┌──────────────────────────────┐
│       Blockchain Layer        │
│ (Ethereum / Polygon / L2)     │
│ Smart Contracts:              │
│  - Task Allocation            │
│  - Reputation & Tokens        │
│  - Data Exchange Ledger       │
└──────────────────────────────┘
            ▲        ▲
            │        │
┌───────────┴────────┴───────────┐
│       Edge / Cloud Layer        │
│   - VM per Robot Instance       │
│   - AI Decision Module (ROS2)   │
│   - Blockchain Node Client      │
│   - Simulation Environment      │
└────────────────────────────────┘
            ▲
            │
┌───────────┴──────────┐
│   Physical Robots /   │
│   Simulated Robots    │
│   (Drones, Rovers)    │
│ Sensors / Actuators   │
└───────────────────────┘
```

## Layer Breakdown

### 1. Robot Layer

The physical or simulated robots that execute tasks:
- ROS2-based control systems
- Sensors (cameras, LiDAR, GPS)
- Actuators (motors, servos)
- Communication interfaces

### 2. Virtual Machine Layer

Each robot runs in an isolated VM environment:
- **Simulation**: Gazebo/Webots for safe testing
- **AI Sandbox**: Training and behavior validation
- **Blockchain Node**: Light client for transaction verification
- **Isolation**: Docker/VM ensures security and reproducibility

### 3. Blockchain Layer

Smart contracts handle:
- **Task Allocation**: Decentralized task distribution
- **Reputation System**: Track robot performance
- **Token Economy**: ROBOX (RX) token for rewards and payments
- **Data Ledger**: Immutable record of all transactions

## Communication Flow

1. **Task Creation** → Smart contract publishes new mission
2. **Robot Bidding** → Robots submit offers with cost estimates
3. **Task Assignment** → Contract selects optimal robot
4. **Execution** → Robot performs task in VM/physical environment
5. **Result Submission** → Robot uploads results to IPFS
6. **Verification** → Smart contract verifies and distributes rewards

## Key Components

| Component | Technology |
|-----------|-----------|
| Robot Control | ROS2 (Robot Operating System 2) |
| Simulation | Gazebo / Webots / Isaac Sim |
| VM Management | Docker / VirtualBox / Kubernetes |
| Blockchain | Ethereum (Sepolia testnet) / Polygon |
| Smart Contracts | Solidity + Hardhat |
| Off-chain Communication | IPFS / MQTT / REST API |
| Token | ERC-20 (ROBOX - RX) |

## Benefits of This Architecture

- ✅ **Decentralization**: No single point of failure
- ✅ **Transparency**: All transactions recorded on-chain
- ✅ **Security**: VM isolation protects against malicious code
- ✅ **Scalability**: Easy to add new robots to the network
- ✅ **Incentivization**: Token rewards encourage participation

---

Next: Learn about [Blockchain Integration](/docs/blockchain/overview) or [ROBOX Token](/docs/token/overview).

