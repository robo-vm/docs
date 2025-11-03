---
sidebar_position: 1
---

# Blockchain Overview

The blockchain layer serves as the consensus network between robots, enabling decentralized coordination without a central authority.

## Role of Blockchain

Blockchain functions as a **robot consensus network**:

- **Smart contracts** manage tasks, rewards, and communication
- Each robot has a unique **blockchain address** (own wallet)
- Robots can:
  - Send transactions to announce mission status
  - "Vote" on collective decisions (e.g., which robot goes to an area)
  - Make **micro-transactions** for data exchange (maps, images, measurements)

## Network Choice

### Recommended Networks

- **BSC Testnet** (Ethereum testnet) - For development and testing
- **BSC Testnet** - Lower gas costs, faster transactions
- **Arbitrum/Optimism** - Layer 2 solutions for scalability

### Production Considerations

For production, consider:
- **BSC** - Low fees, good for frequent transactions
- **BSC Mainnet** - Maximum security, higher costs
- **Custom L2** - Optimized for robot-specific use cases

## Key Features

### Transparency

All transactions are recorded on-chain:
- Task assignments
- Robot bids
- Reward distributions
- Reputation changes

### Immutability

Once recorded, transactions cannot be altered:
- Historical task data
- Robot performance records
- Token transfers

### Decentralization

No single point of control:
- Anyone can create tasks
- Any robot can participate
- No central authority required

## Workflow Examples

### Scenario 1: Automatic Task Allocation

1. A smart contract publishes a **new mission** ("Map area X")
2. Interested robots send offers (transactions) with estimated cost in RVM tokens
3. Contract automatically selects robot with optimal offer
4. Upon completion, robot sends hash of collected data → contract verifies → releases RVM reward

### Scenario 2: Collaboration and Data Exchange

1. Robot A has an updated local map
2. Robot B needs that area → sends request on blockchain
3. Robot A requests 5 RVM tokens for data
4. After payment confirmation, data transmitted off-chain (via IPFS or secure API)

## Smart Contract Architecture

### Core Contracts

1. **RoboToken (RVM)** - BEP-20 token
2. **RoboTask** - Task management
3. **Reputation** - Robot reputation and staking

### Contract Interactions

```
RoboToken ──┐
            ├──> RoboTask ──> Reputation
            └──> Reputation
```

## Gas Optimization

### Strategies

- **Batch operations** - Combine multiple actions
- **Event-based updates** - Off-chain listeners
- **Layer 2 solutions** - Lower fees
- **State channels** - For micro-payments

### Cost Estimates

- Task creation: ~0.001 ETH (testnet)
- Task acceptance: ~0.0005 ETH
- Result submission: ~0.001 ETH
- Finalization: ~0.0005 ETH

*Note: Costs vary by network and gas prices*

## Security Considerations

- **Reentrancy protection** - Prevent recursive calls
- **Access control** - Only authorized addresses
- **Input validation** - Sanitize user inputs
- **Overflow protection** - Safe math operations

---

Next: [Blockchain Architecture](/docs/blockchain/architecture) or [Smart Contracts](/docs/contracts/robo-task)

