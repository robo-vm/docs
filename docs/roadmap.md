---
sidebar_position: 2
---

# Roadmap

Development phases and milestones for RoboVM.

## Phase 0: Foundation (Day 0)

**Deliverables:**
- Monorepo structure: `robot/`, `chain/`, `ops/`, `web/`
- Network decision: **BSC** (Ethereum testnet) or **BSC Testnet**
- Token: **BEP-20 "RoboVM (RVM)"** on testnet

**Stack:**
- ROS2 Humble, Gazebo (or Webots), Python 3.10
- Solidity + Hardhat (or Foundry)
- Docker + docker-compose; optional k3s/Kubernetes
- web3.py / ethers.js, IPFS (local or web3.storage)

---

## Phase 1: Basic Simulation + VM (Week 1)

**Objective:** 1 simulated robot in VM, with ROS2 topics and heartbeat.

**Steps:**
1. **VM Setup**: Ubuntu 22.04 minimal, Docker, git, nvidia-container-toolkit (if GPU available)
2. **ROS2 + Gazebo**: Demo package (turtlebot or simple rover)
3. **ROS2 Node `robot_agent`** (Python) that:
   - Publishes telemetry (`/robot/status`)
   - Listens to commands (`/robot/cmd`)
   - Sends periodic "heartbeat"
4. **docker-compose** minimal (in `ops/docker-compose.yml`)

**Deliverable:** Demonstrate sending ROS2 command and receiving status.

---

## Phase 2: Smart Contracts + Token RVM (Week 2)

**Objective:** Contracts for Tasks + BEP-20 RVM, deploy to testnet.

**Steps:**
1. **BEP-20 RVM** (OpenZeppelin)
2. **Contract "RoboTask"** (task registry + escrow):
   - `createTask(desc, rewardRVM, dataHash?)`
   - `acceptTask(taskId)`
   - `submitResult(taskId, resultCid)` (IPFS CID)
   - `finalize(taskId)` → transfers `rewardRVM` to `assigned`
3. **Deploy scripts** Hardhat + `.env` with test key and RPC

**Deliverables:** Contract addresses on testnet + Hardhat unit tests.

---

## Phase 3: Robot ↔ Blockchain Integration (Week 3)

**Objective:** Robot accepts tasks from contract and reports results.

**Steps:**
1. **ROS2 Node "task_listener"** that:
   - Polls/listens to events (`TaskCreated`)
   - Filters suitable tasks (e.g., "scan area A")
   - Calls `acceptTask` via web3.py
2. **Task execution** in simulation (e.g., waypoint traversal)
3. **Upload result** (log/map) to IPFS → CID → `submitResult`
4. **Finalize** (task creator) → RVM reward

**Deliverable:** End-to-end demo: `createTask` → robot accepts → executes → posts `resultCid` → finalize & pay RVM.

---

## Phase 4: Multi-Robot + Bidding Allocation (Week 4)

**Objective:** 2–3 robots (3 VMs), best fit wins the task.

**Steps:**
1. Extend contract with **bidding**:
   - `placeBid(taskId, priceRVM, etaSeconds)`
   - `assignBestBid(taskId)` (automatic/semi-automatic)
2. ROS2 node on each robot calculates cost (battery, distance) → bids
3. Simple dashboard (React + ethers.js) for visualization:
   - Tasks, bids, robot status, transactions

**Deliverables:** Video/screencast with 3 robots bidding and executing.

---

## Phase 5: Security, Reputation & Staking (Week 5)

**Objective:** Minimize result cheating.

**Steps:**
1. **Reputation** per address: +1 for correct task completion, -X for disputes
2. **Staking**: To **accept** tasks > N RVM, robot locks m RVM as guarantee; penalty on fraud
3. **Result verification**: Second robot (auditor) confirms hash/map (paid small reward)

**Deliverables:** Test of "dispute" and staking slashing.

---

## Phase 6: Hardening & Cost Optimization (Week 6)

**Objective:** Performance and reliability.

**Steps:**
- Move events to **L2** (BSC/Arbitrum) + optional **state channels** for micro-payments
- Logs and telemetry off-chain (TimescaleDB/InfluxDB + Grafana)
- CI/CD: lint + tests + deploy scripts + contract size check

---

## Future Phases

### Phase 7: Advanced Features
- Federated learning for AI
- NFT robot identity
- Multi-chain support

### Phase 8: Production
- Mainnet deployment
- Hardware integration
- Enterprise features

---

## Key Milestones

| Phase | Milestone | Status |
|-------|-----------|--------|
| Phase 0 | Foundation Setup | ✅ Complete |
| Phase 1 | Basic Simulation | 🔄 In Progress |
| Phase 2 | Smart Contracts | 📋 Planned |
| Phase 3 | Integration | 📋 Planned |
| Phase 4 | Multi-Robot | 📋 Planned |
| Phase 5 | Security | 📋 Planned |
| Phase 6 | Optimization | 📋 Planned |

---

**Current Status:** Phase 0 complete, moving to Phase 1.

