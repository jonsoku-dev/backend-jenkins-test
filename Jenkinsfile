pipeline {
  agent any
  environment {
    HOME = '.' // Avoid npm root owned
  }
  stages {
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
    stage('BUILD Backend') {
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
                sshTransfer(execCommand: "rm -rf index.html"),
                sshTransfer(execCommand: "touch index.html"),
              ]
            )
          ]
        )
      }
    }
  }
}