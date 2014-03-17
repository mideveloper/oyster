
module.exports = function(grunt) {

    // Load all grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Time how long tasks take
    require("time-grunt")(grunt);

    grunt.config.init({
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            all: {
                src: [
                    "routes.js",
                    "global_async.js",
                    "Gruntfile.js",
                    "controllers/*.js",
                    "components/*.js",
                    "lib/**/*.js",
                    "tests/**/*.js",
                    "middleware/*.js"
                   
                ]
            }
        },
        
        mochaTest: {
            options: {
                globals: ["should"],
                timeout: 10000,
                ui: "bdd",
                reporter: "dot"
            },
            all: {
                src: ["tests/**/*.js"]
            }
        },
        
        watch: {
            files: [
                "Gruntfile.js",
                "controllers/*.js",
                "lib/**/*.js",
                "middleware/*.js",
                "tests/**/*.js"
                
            ],
            default: {
                files: "<%= watch.files %>",
                tasks: ["newer:jshint", "mochaTest"]
            }
            
        }
    });

    grunt.registerTask("test", ["jshint",  "mochaTest"]);
    grunt.registerTask("default", ["watch:default"]);
};

