const { User, Quiz, Score } = require('./model.js').models;

exports.play = async (rl) => {
  // Show all quizzes in DB
  let quizzes = await Quiz.findAll();

  // If there are no quizzes
  if (quizzes.length === 0) {
    return rl.log('  Sorry, there are no quizzes in DB :(');
  }

  let continuePlaying = true;
  let score = 0;

  // Ask a quiz while there are quizzes or player answer right
  do {
    // Get a random quiz
    let q = quizzes[Math.floor(Math.random() * quizzes.length)];

    // Ask que quiz
    let answered = await rl.questionP(q.question);

    // Check and show if it was right
    let result =
      answered.toLowerCase().trim() === q.answer.toLowerCase().trim();
    rl.log(`  The answer "${answered}" is ${result ? 'right' : 'wrong'}!`);

    if (result) {
      // Remove the quiz
      let index = quizzes.findIndex((e) => e.question === q.question);
      quizzes.splice(index, 1);

      // Add a point to score
      score = score + 1;
    }

    // If there are no more quizzes or player answered wrong
    if (quizzes.length === 0 || !result) {
      // Stop playing
      continuePlaying = false;
    }
  } while (continuePlaying === true);
  // Show the score
  rl.log(`  Score: ${score}`);

  // Ask the user name
  let name = await rl.questionP('Enter user');
  if (!name) throw new Error("Response can't be empty!");

  // Find the user
  let user = await User.findOne({ where: { name } });

  // If the user doesn't exist
  if (!user) {
    // Create a new user with 0 age
    user = await User.create({ name, age: 0 });
  }

  // Create the score
  await Score.create({
    wins: score,
    userId: user.id,
  });

};
