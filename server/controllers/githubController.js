const { getInstallationAccessToken } = require("../utils/github");
const githubAccountSchema = require("../db/models/githubAccountSchema");
const axios = require("axios");
const githubServices = require("../services/githubServices");



module.exports.storeGithubAccessToken = async (req, res) => {
    const installationId = req.query.installation_id;
    console.log("Installation ID:", installationId);
    console.log(req.query);
    
    if (!installationId) {
      return res.status(400).send("No installation_id found");
    }

  try {
    
    const installationAccessToken = await getInstallationAccessToken(installationId);
    console.log("Installation Access Token:", installationAccessToken);

    const userGithub = {
      installationId: installationId,
      installationAccessToken: installationAccessToken,
      userId: req.user._id,
    }
    const githubAccount = await githubAccountSchema.create(userGithub);
    console.log("GitHub Account:", githubAccount);
  
   return res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during GitHub OAuth");
  }
}
module.exports.getRepositories = async (req, res) => {
    const userId = req.user._id;
    
    const githubData = await githubAccountSchema.findOne({ userId: userId });
    if (!githubData) {
        return res.status(400).json({ message: 'User has not installed the GitHub App' });
    }
    try {
        const token = githubData.installationAccessToken;
        console.log('Token:', token);
        const repos = await axios.get('https://api.github.com/installation/repositories', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github+json',
            },
        });
        const githubRepo = repos.data.repositories;
        await githubServices.syncReposToDb(userId, githubRepo);
        res.json(repos.data);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ message: 'Error fetching repositories' });
    }
}