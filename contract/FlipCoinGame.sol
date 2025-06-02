// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FlipACoinGame {
    address public owner;

    enum Choice { Heads, Tails }

    event GamePlayed(address indexed player, Choice choice, Choice result, bool win, uint256 amountWon);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(owner).transfer(amount);
    }

    function playGame(Choice _userChoice) external payable {
        require(msg.value > 0, "Must bet some ETH");

        // Generate pseudo-random outcome (Heads or Tails)
        uint256 random = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))
        ) % 2;

        Choice result = Choice(random);
        bool win = (_userChoice == result);

        uint256 reward = 0;

        if (win) {
            reward = (msg.value * 3) / 2; // 1.5x reward
            require(address(this).balance >= reward, "Contract cannot pay reward");
            payable(msg.sender).transfer(reward);
        }

        emit GamePlayed(msg.sender, _userChoice, result, win, reward);
    }

    function fundContract() external payable {}

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
