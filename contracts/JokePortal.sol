// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract JokePortal {
    uint256 totalJokes;
    uint256 private seed;

    /*
     * This is an address => uint mapping, meaning I can associate an address with a number!
     * In this case, I'll be storing the address with the last time the user waved at us.
     */
    mapping(address => uint256) public lastJokeAt;

    event NewJoke(address indexed from, uint256 timestamp, string message);

    struct Story {
        address teller; // The address of the user who tell the story.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    Story[] stories;

    constructor() payable {
        console.log("3 2 1 Zero!!! Let's dance! We are on line :)");
        stories.push(
            Story(
                msg.sender,
                "I am bored! Please tell me a joke",
                block.timestamp
            )
        );
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function tellAJoke(string memory _joke) public {
        /*
         * We need to make sure the current timestamp is at least 15-minutes bigger than the last timestamp we stored
         */
        require(
            lastJokeAt[msg.sender] + 1 minutes < block.timestamp,
            "Wait 1 minute"
        );

        /*
         * Update the current timestamp we have for the user
         */
        lastJokeAt[msg.sender] = block.timestamp;

        totalJokes += 1;
        console.log("%s has told a joke!", msg.sender);

        stories.push(Story(msg.sender, _joke, block.timestamp));

        /*
         * Generate a new seed for the next user that sends a wave
         */
        seed = (block.difficulty + block.timestamp + seed) % 100;
        console.log("Random seed generated: ", seed);

        /*
         * Give a 50% chance that the user wins the prize.
         */
        if (seed <= 50) {
            console.log("%s won!", msg.sender);

            /*
             * The same code we had before to send the prize.
             */
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewJoke(msg.sender, block.timestamp, _joke);
    }

    function getTotalJokes() public view returns (uint256) {
        console.log("We have %d total jokes!", totalJokes);
        return totalJokes;
    }

    function getStory() public view returns (Story[] memory) {
        return stories;
    }
}
