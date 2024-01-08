const { Octokit } = require('@octokit/rest');
const env = require("./Environment")

class GithubApi {
    constructor() {
        this.octokit = new Octokit({
            auth: env.GitHub.token,
        })
    }

    upload(name, buffer, callback) {
        const content = buffer.toString('base64')
        this.octokit.repos.createOrUpdateFileContents({
            owner: env.GitHub.owner,
            repo: env.GitHub.repo,
            branch: env.GitHub.branch,
            path: name,
            sha: '64fe6c9dd8d53901975881d2eae51b733c86463b',
            content: content,
            message: env.GitHub.message
        }).then(x => {
            callback(x)
        }).catch(x => {
            console.log(x)
        })
    }
}

module.exports = GithubApi