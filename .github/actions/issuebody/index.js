const core = require("@actions/core");
const github = require("@actions/github");

try {
	// `who-to-greet` input defined in action metadata file
	// npx ncc build .github/actions/issuebody/index.js -o .github/actions/issuebody/dist/
	// npm i -g @zeit/ncc
	const token = core.getInput('token');
	const event = JSON.parse(core.getInput('event'));
	const pattern = core.getInput('issue-regexp');

	const prNumber = event.number;
	const prBody = event.pull_request.body;
	const repo = event.repository.full_name;

	const matches = prBody.match(new RegExp(pattern, "g"));

	core.setOutput("pr-number", prNumber);
	core.setOutput("pr-body", prBody);

	if (matches === null) {
		core.setOutput("issue-number", '');

		return;
	}

	const issueNumberDetected = matches[0].replace(/\D/g, "");
	core.setOutput("issue-number", issueNumberDetected);

	const octokit = new github.getOctokit(token);
	octokit
		.request(`GET /repos/${repo}/issues/${issueNumberDetected}`)
		.then(function (res) {
			const issueBody = 'PR #' + prNumber + "\n\n---\n\n" + 'octocat zaslaný přes ghactions ' + (new Date()).toTimeString() + res.data.body;

			octokit.request(`PATCH /repos/${repo}/issues/${issueNumberDetected}`, {
				body: issueBody,
			})
		})
	;
} catch (error) {
	core.setFailed(error.message);
}
