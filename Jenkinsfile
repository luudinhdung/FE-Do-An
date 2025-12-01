pipeline {
  options { skipDefaultCheckout() }

  agent any

  environment {
    IMAGE = 'dungsave123/chat-frontend'
    DOCKER_CRED = 'dockerhub-cred'
    SSH_CRED = 'gcp-ssh-key'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/luudinhdung/FE-Do-An'
          ]]
        ])
        script {
          env.IMAGE_TAG = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
        }
      }
    }

    stage('Build & Deploy') {
      agent {
        docker {
          image 'docker:27.0.3-cli'
          args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:$WORKSPACE -w $WORKSPACE'
        }
      }
      steps {
        sh '''
          apk add --no-cache nodejs npm
          npm ci
          npm run build

          docker build -t ${IMAGE}:${IMAGE_TAG} .
          
          echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
          docker push ${IMAGE}:${IMAGE_TAG}
          docker tag ${IMAGE}:${IMAGE_TAG} ${IMAGE}:latest
          docker push ${IMAGE}:latest
        '''
      }
    }

    stage('Deploy') {
      steps {
        sshagent([SSH_CRED]) {
          sh """
            ssh -o StrictHostKeyChecking=no user@host '
              cd /home/user/chat-as &&
              docker compose pull frontend || true &&
              docker compose up -d --force-recreate frontend
            '
          """
        }
      }
    }
  }
}
