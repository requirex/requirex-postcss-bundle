require('requirex');

System.build(require('path').resolve(process.argv[2])).then(function(code) {
	process.stdout.write(code);
});
