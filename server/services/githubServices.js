const GithubAccount = require('../db/models/githubAccountSchema');

module.exports.syncReposToDb = async (userId, githubRepos) => {
  const formattedRepos = githubRepos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    clone_url: repo.clone_url,
    html_url: repo.html_url,
    deployedUrl: '', // initially blank
    lastDeployedAt: null,
  }));

  await GithubAccount.findOneAndUpdate(
    { userId },
    {
      $set: {
        repos: formattedRepos,
        syncedAt: new Date(),
      },
    },
    { new: true }
  );
};
