var shell = require('shelljs');

shell.cd('/home/vagrant/fuzzer/');
shell.exec('sudo node fuzzer.js');

shell.cd('{{itrust_folder}}');

shell.exec("sudo git add .");

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
