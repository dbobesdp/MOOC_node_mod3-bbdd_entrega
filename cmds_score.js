const { User, Score } = require('./model.js').models;

exports.list = async (rl) => {
  let scores = await Score.findAll({
    order: [['wins','DESC']],
    include: [
      {
        model: User,
        as: 'player',
      },
    ],
  });

  scores.forEach((s) =>
    rl.log(`  ${s.player.name}|${s.wins}|${s.createdAt.toUTCString()}`)
  );
};
