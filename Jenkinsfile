// node {
//     def commit_id
//     stage('Preparation') {
//         checkout scm
//         sh "git rev-parse --short HEAD > .git/commit-id"
//         commit_id = readFile('.git/commit-id').trim()
//     }
//     stage('test') {
//         def myTestContainer = docker.image('node:16.8.0')
//         myTestContainer.pull()
//         myTestContainer.inside {
//         sh 'npm install --only=dev'
//         sh 'npm test'
//       }
//     }
//     stage('docker build/push') {
//         docker.withRegistry('https://index.docker.io/v1/', '8b3bd7e3-bf55-4322-bca8-4d7610a9c31c') {
//             def app = docker.build("the2792/backend-jenkins-test:${commit_id}", '.').push()
//         }
//     }
// }

pipeline {
    agent any

    environment {
        HOME = '.' // Avoid npm root owned
    }
    stages {
        stage('Example Stage 1') {
            steps {
                echo "wow"
            }

            post {
                            // If Maven was able to run the tests, even if some of the test
                            // failed, record the test results and archive the jar file.
                            success {
                                echo 'Successfully Cloned Repository'
                            }

                            always {
                              echo "i tried..."
                            }

                            cleanup {
                              echo "after all other post condition"
                            }
                        }
        }
        stage('Example Stage 2') {
            agent {
                        docker {
                            image 'node:latest'
                          }
                        }
            steps {
                echo "TEST SERVER"
                sh 'npm install'
                sh 'npm test'
            }
        }
        stage('Bulid Backend') {
          agent any
          steps {
            echo 'Build Backend'
            sh "docker build . -t server"
          }

          post {
            failure {
              error 'This pipeline stops here...'
            }
          }
        }
        stage('Deploy Backend') {
            agent any
            steps {
              echo 'Build Backend'
              sh '''
              docker rm -f $(docker ps -aq)
              docker run -p 80:80 -d server
              '''
            }
        }
    }
}