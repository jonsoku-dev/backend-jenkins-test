def commitId = ""

pipeline {
  agent any
  environment {
    HOME = '.' // Avoid npm root owned
  }
  stages {
    stage('Preparation') {
        steps {
            script {
                        checkout scm
                        sh "git rev-parse --short HEAD > .git/commit-id"
                        commitId = readFile('.git/commit-id').trim()
            }
        }
    }
    stage('TEST Frontend') {
      agent {
        docker {
          image 'node:latest'
        }
      }
      steps {
        dir("./front") {
          sh "cat index.html"
        }
      }
    }
    stage('BUILD Frontend') {
      agent any
      steps {
        dir("./front") {
          sh "cat index.html"
        }
      }
    }
    stage('TEST Backend') {
      agent {
        docker {
          image 'node:latest'
        }
      }
      steps {
        dir("./server") {
          sh "cat index.html"
        }
      }
      post {
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
    stage('BUILD Backend Image') {
      agent any
      steps {
        script {
          dockerImage = docker.build "dsfkdslfjdsjflkdsjf"
        }
      }
      post {
        failure {
          error 'This pipeline stops here...'
        }
      }
    }
    stage('Push Backend Image') {
      agent any
      steps {
        script {
          docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
            def app = docker.build("the2792/backend-jenkins-test:${commitId}", '.').push()
          }
        }
      }
      post {
        failure {
          error 'This pipeline stops here...'
        }
      }
    }
    stage('SSH transfer (deploy)') {
      steps([$class: 'BapSshPromotionPublisherPlugin']) {
        sshPublisher(
          continueOnError: false, failOnError: true,
          publishers: [
            sshPublisherDesc(
              configName: "backend-test",
              verbose: true,
              transfers: [
                sshTransfer(execCommand: "docker stop the2792/backend-jenkins-test:8497d72"),
                sshTransfer(execCommand: "docker pull the2792/backend-jenkins-test:8497d72"),
                sshTransfer(execCommand: "docker run -p 3000:3000 -d the2792/backend-jenkins-test:8497d72"),
              ]
            )
          ]
        )
      }
    }
  }
}