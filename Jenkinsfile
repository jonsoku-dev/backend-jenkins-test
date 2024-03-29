def commitId = ""
def dockerImage = ""
def registry = "the2792/backend-jenkins-test"

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
          dockerImage = docker.build registry
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
          docker.withRegistry('https://index.docker.io/v1/', '8b3bd7e3-bf55-4322-bca8-4d7610a9c31c') {
            dockerImage.push("${commitId}")
            dockerImage.push("latest")
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
//                 sshTransfer(execCommand: "docker stop the2792/backend-jenkins-test:8497d72"),
                sshTransfer(execCommand: "docker pull the2792/backend-jenkins-test"),
//                 sshTransfer(execCommand: "docker run -p 3000:3000 -d the2792/backend-jenkins-test:8497d72"),
              ]
            )
          ]
        )
      }
    }
  }
}