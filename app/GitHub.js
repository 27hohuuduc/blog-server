const fs = require('fs')
const { Octokit } = require("octokit")

const config = JSON.parse(fs.readFileSync('config.json')).GitHub

const octokit = new Octokit({
    auth: config.token
})

/**
 * Request Get to GitHub
 * @param {config} config
 * @returns {Object<JSON>} Data
*/
const Get = async () => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: config.owner,
        repo: config.repo,
        path: 'README.md',
        committer: {
            name: config.name,
            email: config.email
        }
    })
    return res.data
}

/**
 * Request Put to GitHub
 * @param {string} filename 
 * @param {string} content
 * @param {config} config 
 * @returns {Object<JSON>} Data
*/
const Put = async (filename, content, config) => {
    const res = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: config.owner,
        repo: config.repo,
        path: filename,
        message: config.commit,
        committer: {
            name: config.name,
            email: config.email
        },
        content: btoa(content)
    })
    return res.data
}

const Delete = async () => {
    const res = await octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
        owner: config.owner,
        repo: config.repo,
        path: filename,
        message: 'Last commit',
        committer: {
            name: '27hohuuduc',
            email: '27hohuuduc@gmail.com'
        },
        sha: '0d5a690c8fad5e605a6e8766295d9d459d65de42'
    })
    return res.data
}

module.exports = {
    Get,
    Put,
    Delete
}