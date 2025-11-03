---
sidebar_position: 3
---

# ROBOX Token Smart Contract

Technical details of the ROBOX (RX) ERC-20 token contract.

## Contract Overview

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RoboToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**18;
    
    constructor() ERC20("ROBOX", "RX") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}
```

## Key Features

### Standard ERC-20 Functions

- `transfer(address to, uint256 amount)` - Send tokens
- `transferFrom(address from, address to, uint256 amount)` - Transfer on behalf
- `approve(address spender, uint256 amount)` - Allow spending
- `balanceOf(address account)` - Check balance
- `totalSupply()` - Total tokens in circulation

### Extended Functions

```solidity
// Minting (only owner)
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}

// Burning
function burn(uint256 amount) external {
    _burn(msg.sender, amount);
}

// Transfer ownership (for governance)
function transferOwnership(address newOwner) external onlyOwner {
    _transferOwnership(newOwner);
}
```

## Integration with RoboTask

### Approval Pattern

```solidity
// In RoboTask contract
function finalizeTask(uint256 taskId) external {
    Task storage task = tasks[taskId];
    
    // Transfer reward from contract to robot
    roboToken.transferFrom(
        address(this),  // Contract holds rewards
        task.assigned,  // Robot address
        task.reward     // Amount
    );
}
```

### Setup

```solidity
// Deploy RoboToken
RoboToken roboToken = new RoboToken();

// Deploy RoboTask with token reference
RoboTask roboTask = new RoboTask(address(roboToken));

// Approve RoboTask to spend tokens
roboToken.approve(address(roboTask), type(uint256).max);
```

## Security Features

### OpenZeppelin Standards

- **ReentrancyGuard** - Prevents recursive calls
- **SafeMath** - Overflow protection (built-in Solidity 0.8+)
- **AccessControl** - Role-based permissions

### Best Practices

- **No hidden functions** - All functions documented
- **Events for all transfers** - Full transparency
- **Standard interface** - Compatible with wallets

## Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

## Usage Examples

### Web3.js

```javascript
const RoboToken = artifacts.require("RoboToken");

// Get balance
const balance = await roboToken.balanceOf(robotAddress);
console.log(`Balance: ${balance.toString()} RX`);

// Transfer tokens
await roboToken.transfer(recipientAddress, amount, { from: sender });

// Approve spending
await roboToken.approve(spenderAddress, amount, { from: owner });
```

### web3.py

```python
from web3 import Web3

# Get contract instance
robo_token = w3.eth.contract(
    address=token_address,
    abi=token_abi
)

# Check balance
balance = robo_token.functions.balanceOf(robot_address).call()
print(f"Balance: {balance / 10**18} RX")

# Transfer
tx = robo_token.functions.transfer(
    recipient_address,
    amount
).build_transaction({
    "from": sender_address,
    "nonce": w3.eth.get_transaction_count(sender_address)
})
```

## Deployment

### Testnet Deployment

```bash
# Using Hardhat
npx hardhat run scripts/deploy-token.js --network sepolia

# Deployed address will be saved
# Add to .env file
ROBOX_TOKEN_ADDRESS=0x...
```

### Verification

```bash
npx hardhat verify --network sepolia \
  --contract contracts/RoboToken.sol:RoboToken \
  0x...DEPLOYED_ADDRESS
```

## Contract Address

**Sepolia Testnet:**
```
TBD - Deploy when ready
```

**Mainnet:**
```
TBD - Deploy after testing
```

---

Next: [Use Cases](/docs/token/use-cases) or [Smart Contracts Overview](/docs/contracts/robo-task)

