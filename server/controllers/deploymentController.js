const { getInstallationAccessToken } = require("../utils/github");
const githubAccountSchema = require("../db/models/githubAccountSchema");
const axios = require("axios");
module.exports.newDeployement = async (req, res) => {
    const userId = req.user._id;
    const repoId = req.query.repoId;
    const port = req.query.port;
    const subdomain = req.query.subdomain;
    console.log('Repo Id: '+ repoId);
    console.log(req.query)
    const installationId = await githubAccountSchema.findOne({ userId: userId });
    if (!installationId) {
        return res.status(400).json({ message: 'User has not installed the GitHub App' });
    }
   const iid = installationId.installationId;
    const token = await getInstallationAccessToken(iid);
    console.log('Token:', token);
    if (!token) {
        return res.status(400).json({ message: 'No token found' });
    }
    console.log('Token:', token);
    // get repo details from repoId
    const repos = await githubAccountSchema.findOne({ userId: userId });
    if (!repos) {
        return res.status(400).json({ message: 'No repoData found' });
    }
   
    const repoData = repos.repos.find(r => r.id == repoId);
    if (!repoData) {
        return res.status(400).json({ message: 'No repo found' });
    }
    try {
        const deploy = await axios.post(`${process.env.WORKER_URL}/deploy`, {
        repoId: repoData.id,
        port: port,
        subdomain: subdomain,
        repoName: repoData.name,
        installationAccessToken: token,
        repoUrl: repoData.clone_url,
        token: token
    });
    console.log('Deploy:', deploy.data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error during deployment' });
    }
    
    
    res.send(repoData);
}