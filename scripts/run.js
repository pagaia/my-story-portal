const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const jokeContractFactory = await hre.ethers.getContractFactory("JokePortal");
  const jokeContract = await jokeContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1")
  });

  await jokeContract.deployed();

  console.log("Contract addy:", jokeContract.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    jokeContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  console.log("Contract deployed to:", jokeContract.address);
  console.log("Contract deployed by:", owner.address);

  let jokeCount;
  let story;
  jokeCount = await jokeContract.getTotalJokes();
  story = await jokeContract.getStory();
  let indexStory = 0;

  console.log("The story begins...");
  console.log(story[indexStory].message);
  console.log("Teller: ", story[indexStory].teller);
  console.log("Story  added on: ", story[indexStory].timestamp);

  let jokeTxn = await jokeContract.tellAJoke("C'era una volta un libro");
  await jokeTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(jokeContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  jokeCount = await jokeContract.getTotalJokes();
  story = await jokeContract.getStory();

  indexStory++;

  console.log("The story  continues...");
  console.log(story[indexStory].message);
  console.log("Teller: ", story[indexStory].teller);
  console.log("Story  added on: ", story[indexStory].timestamp);

  jokeTxn = await jokeContract.tellAJoke("Un libro su una stanza");
  await jokeTxn.wait();
  jokeCount = await jokeContract.getTotalJokes();
  story = await jokeContract.getStory();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(jokeContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  indexStory++;

  console.log("The story  continues again...");
  console.log(story[indexStory].message);
  console.log("Teller: ", story[indexStory].teller);
  console.log("Story  added on: ", story[indexStory].timestamp);

  console.log(story);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
