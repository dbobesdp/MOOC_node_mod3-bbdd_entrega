const { User, Quiz } = require('./model.js').models;

exports.play = async (rl) => {
  // Show all quizzes in DB including
  let quizzes = await Quiz.findAll();

  if (quizzes.length === 0) {
    return rl.log('Sorry, there are no quizzes in DB :(');
  }

  let continuePlaying = true;
  let score = 0;

  // Ask quizzes while there are quizzes or he/she answered right
  do {
    // Get a random quizz
    let q = quizzes[Math.floor(Math.random() * quizzes.length)];

    // Ask que quizz
    let answered = await rl.questionP(q.question);

    // Check and show if it was right
    let result = answered.toLowerCase().trim() === q.answer.toLowerCase().trim();
    rl.log(`  The answer "${answered}" is ${result? 'right': 'wrong'}!`);

    if(result){
      // Remove the quizz
      let index = quizzes.findIndex((e) => e.question === q.question);
      quizzes.splice(index, 1);

      // Add a point to score
      score = score + 1;
    }

    // If there are no more quizzes or he/she answered wrong
    if (quizzes.length === 0 || !result) {
      // Show the score
      rl.log(`  Score: ${score}`);

      // Stop playing
      continuePlaying = false;
    }   
  } while (continuePlaying === true);
};
