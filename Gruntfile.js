module.exports = function(grunt){
	grunt.initConfig({
		express: {
			options: {
				background: false,
				port: 8080
			},
			server: {
				options: {
					script: 'main.js'
				}
			}
		},
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('serve', ['express:server']);
}
