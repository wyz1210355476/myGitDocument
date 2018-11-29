var chalk = require('chalk');
var packageConfig = require('../package.json');
var shell = require('shelljs');
var semver = require('semver');

function exec(cmd){//检测某安装包当前版本方法
	return require('child_process').execSync(cmd).toString().trim();
}

// 缓存node版本和需要的最低版本
var versionRequirements = [
	{
		name:'node',
		currentVersion:semver.clean(process.version),
		versionRequirement:packageConfig.engines.node
	}
]

// 缓存npm版本和需要的最低版本
if(shell.which('npm')){
	versionRequirements.push({
		name:'npm',
		currentVersion:exec('npm --version'),
		versionRequirement:packageConfig.engines.npm
	})
}

module.exports = function(){
	// 缓存版本不符合要求的提示信息
	var warings = [];
	for(var i = 0; i < versionRequirements.length; i++){
		var mod = versionRequirements[i];
		if(!semver.satisfies(mod.currentVersion,mod.versionRequirement)){
			warings.push(mod.name + ':' +
				chalk.red(mod.currentVersion) + 'should be' +
				chalk.green(mod.versionRequirement)
			)
		}
	}

	if(warings.length){
		console.log('');
		console.log(chalk.yellow('To use this template, you must be update following to modules:'));
		console.log();
		for(var i = 0; i < warings.length; i++){
			var waring = warings[i];
			console.log('   ' + waring);
		}
		console.log()
		process.exit(1)
	}
}