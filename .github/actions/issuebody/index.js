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

	const prependIssueMessage = core.getInput('prepend-issue-message');
	const prependIssueMessageReplaced = prependIssueMessage
		.replace(/\[\[issueNumber\]\]/g, issueNumberDetected)
		.replace(/\[\[prNumber\]\]/g, prNumber)
	;

	const appendIssueMessage = core.getInput('append-issue-message');
	const appendIssueMessageReplaced = appendIssueMessage
		.replace(/\[\[issueNumber\]\]/g, issueNumberDetected)
		.replace(/\[\[prNumber\]\]/g, prNumber)
	;

	if (prependIssueMessageReplaced === '' && appendIssueMessage === '') {
		core.setFailed('Není nic k nahrazení. Nebudeme updatovat popis issue');
	}

	// const searchUrl = `GET https://api.github.com/search/issues?q=is:pr+repo:${repo}+in:body+"Issue: %23${issueNumberDetected}"`;
	const searchUrl = 'https://api.github.com/search/issues?q=is:pr+repo:milous/actions-pr-issue-comment+in:body+"Issue: %234"';
	console.log(searchUrl);
	const octokit = new github.getOctokit(token);

	octokit
		.request(searchUrl)
		.then(function (res) {
			console.log(res);
			console.log(res.data);
		})
	;

	octokit
		.request(`GET /repos/${repo}/issues/${issueNumberDetected}`)
		.then(function (res) {
			let issueBody = res.data.body;
			if (prependIssueMessageReplaced !== '') {
				issueBody = prependIssueMessageReplaced + "\n" + issueBody;
			}

			if (appendIssueMessageReplaced !== '') {
				issueBody += "\n" + appendIssueMessageReplaced;
			}

			octokit.request(`PATCH /repos/${repo}/issues/${issueNumberDetected}`, {
				body: issueBody,
			});
		})
	;


	octokit
		.request(`GET /repos/${repo}/issues/${issueNumberDetected}`)
		.then(function (res) {
			let issueBody = res.data.body;
			if (prependIssueMessageReplaced !== '') {
				issueBody = prependIssueMessageReplaced + "\n" + issueBody;
			}

			if (appendIssueMessageReplaced !== '') {
				issueBody += "\n" + appendIssueMessageReplaced;
			}

			octokit.request(`PATCH /repos/${repo}/issues/${issueNumberDetected}`, {
				body: issueBody,
			});
		})
	;
} catch (error) {
	core.setFailed(error.message);
}
