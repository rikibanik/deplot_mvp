// models/GithubAccount.js

const mongoose = require('mongoose');

const githubAccountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming you have a User model
    required: true,
    unique: true,
  },
  githubUsername: String,
  githubId: Number,
  installationId: String,
  repos: [
    {
      id: Number,
      name: String,
      full_name: String,
      clone_url: String,
      html_url: String,
      deployedUrl: String, 
      lastDeployedAt: Date,
    },
  ],
  syncedAt: Date,
});

module.exports = mongoose.model('GithubAccount', githubAccountSchema);
