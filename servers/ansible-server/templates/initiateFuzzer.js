var shell = require('shelljs');

shell.cd('/home/vagrant/fuzzer/');
shell.exec('node fuzzer.js');

shell.cd('{{ itrust_folder }}');
shell.exec
shell.exec("sudo git add .");
// setTimeout(function(){
// 	shell.exec('sudo git commit -m "test commit"');
// }, 10000);
if (shell.exec('sudo git commit -am "test commit"').code !== 0) {
	shell.echo('Error: Git commit failed')
	shell.exit(1)
}
else{
	shell.echo("hi")
}

// setTimeout(function(){
// 	shell.cd('{{ itrust_folder }}');
// 	shell.exec("git revert HEAD");
// }, 10000);