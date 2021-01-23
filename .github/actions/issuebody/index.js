const core = require("@actions/core");
const github = require("@actions/github");

try {
	// `who-to-greet` input defined in action metadata file
	// npx ncc build .github/actions/issuebody/index.js -o .github/actions/issuebody/dist/
	// npm i -g @zeit/ncc
	const token = core.getInput('token');
	const event = JSON.parse(core.getInput('event'));
	const issueNumber = core.getInput('issue-number');
	const pattern = core.getInput('issue-regexp');
	const prNumber = event.number;
	const prBody = event.pull_request.body;
	const repo = event.repository.full_name;

	console.log(prBody);
	// console.log(regexp);

	const matches = prBody.match(new RegExp(pattern, "g"));

	if (matches === null) {
		console.log('Nepodařilo se načíst číslo issue z PR message');

		return;
	}

	console.log('issue number z pr body' + matches[0].replace(/\D/g, ""));



	// // var re = new RegExp("Issue: #([0-9]+)", "g");
	// myString.match(re)[0].replace(/\D/g, "");
	//
	// if ()
	//
	// 	var myString = "something Issue: # 1234 format_abc";
	// var re = new RegExp("Issue: #([0-9]+)", "g");
	// myString.match(re);
	// 	[0].replace(/\D/g, "");

	// console.log(prBody.match(re));
	// const issueBodyPrefix = core.getInput('issue-body-prefix');
	// const issueBodySuffix = core.getInput('issue-body-suffix');

	const octokit = new github.getOctokit(token);
	octokit
		.request(`GET /repos/${repo}/issues/${issueNumber}`)
		.then(function (res) {
			const issueBody = 'PR #' + prNumber + "\n\n---\n\n" + 'octocat zaslaný přes ghactions ' + (new Date()).toTimeString() + res.data.body;

			octokit.request(`PATCH /repos/${repo}/issues/${issueNumber}`, {
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
