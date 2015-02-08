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
		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'*.js',
				'public/*/*.js'
			]
		},
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-express-server');

	grunt.registerTask('serve', ['express:server']);
	grunt.registerTask('test', ['jshint']);
};
