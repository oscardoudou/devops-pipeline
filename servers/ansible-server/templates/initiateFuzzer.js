var shell = require('shelljs');

shell.cd('/home/vagrant/fuzzer/');
shell.exec('node fuzzer.js');

shell.cd('{{ itrust_folder }}');
// shell.exec("git add .");
// shell.exec(`git commit -m "test commit"`);

setTimeout(function(){
	shell.cd('{{ itrust_folder }}');
	shell.exec("git revert HEAD");
}, 10000);