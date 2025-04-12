const gitService = require('../services/gitServices');
const dockerService = require('../services/dockerService');
const { log } = require('../utils/logger');

exports.handleDeployment = async (req, res) => {
  const { repoUrl, repoName, port, subdomain } = req.body;

  if (!repoUrl || !repoName || !port || !subdomain) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    await gitService.cloneRepo(repoUrl, repoName);
    await dockerService.deployContainer(repoName, port, subdomain);
    log(`${repoName} deployed successfully`);
    res.json({ message: 'Deployed successfully' });
  } catch (error) {
    log(`Deployment failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
