pipeline {
    agent any
    stages {
        def commit_id
        stage('Preparation') {
            steps {
                checkout scm
                sh "git rev-parse --short HEAD > .git/commit-id"
                commit_id = readFile('.git/commit-id').trim()
            }
        }
        stage('test') {
            def myTestContainer = docker.image('node:16.8.0')
            myTestContainer.pull()
            myTestContainer.inside {
            sh 'npm install --only=dev'
            sh 'npm test'
          }
        }
        stage('docker build/push') {
            docker.withRegistry('https://index.docker.io/v1/', '8b3bd7e3-bf55-4322-bca8-4d7610a9c31c') {
                def app = docker.build("the2792/backend-jenkins-test:${commit_id}", '.').push()
            }
        }
    }
}