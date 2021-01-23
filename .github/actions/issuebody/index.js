const core = require("@actions/core");
const github = require("@actions/github");

try {
	// `who-to-greet` input defined in action metadata file
	// npx ncc build .github/actions/issuebody/index.js -o .github/actions/issuebody/dist/
	// npm i -g @zeit/ncc
	const token = core.getInput('token');
	const issueNumber = core.getInput('issue-number');
	const prNumber = core.getInput('pr-number');

	const octokit = new github.getOctokit(token);

	// const issueBody = 'octocat zaslaný přes ghactions ' + (new Date()).toTimeString();

	octokit
		.request('GET /repos/milous/actions-pr-issue-comment/issues/1')
		.then(function (res) {
			console.log(res.data.body);

			const issueBody = 'PR #' + prNumber + "\n---\n" + 'octocat zaslaný přes ghactions ' + (new Date()).toTimeString() + res.data.body;

			octokit.request('PATCH /repos/milous/actions-pr-issue-comment/issues/1', {
				body: issueBody,
			})
		})
	;

	// octokit.request('PATCH /repos/milous/actions-pr-issue-comment/issues/1', {
	// 	body: issueBody,
	// })


	console.log(`IssueNumber ${issueNumber}!`);
	console.log(`PrNumber ${prNumber}!`);
	const time = (new Date()).toTimeString();
	//
	core.setOutput("time", time);
	// // Get the JSON webhook payload for the event that triggered the workflow
	// const payload = JSON.stringify(github.context.payload, undefined, 2)
	// console.log(`The event payload: ${payload}`);

} catch (error) {
	core.setFailed(error.message);
}
