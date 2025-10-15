pipeline {
  agent {
    docker {
      // Image có sẵn Docker CLI, ta mount Docker socket để Jenkins dùng Docker ngoài host
      image 'docker:27.0.3-cli'
      args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

   environment {
    IMAGE = "dungsave123/chat-frontend"
    DOCKER_CRED = 'dockerhub-credentials'
    SSH_CRED = 'gcp-ssh-key'
    REMOTE_USER = 'dinhtuanzzzaa'
    REMOTE_HOST = '35.188.81.254'
    REMOTE_PROJECT_DIR = '/home/dinhtuanzzzaa/chat-as' // replace if different
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
        script {
          GIT_SHORT = sh(returnStdout: true, script: "git rev-parse --short HEAD").trim()
          env.IMAGE_TAG = "${GIT_SHORT}"
        }
      }
    }

    stage('Install & Build') {
      steps {
          sh 'npm ci'
          sh 'npm run build'
      }
    }
    

    stage('Clean Docker Cache') {
      steps {
          sh 'docker system prune -af || true'
      }
  }
    
    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${IMAGE}:${IMAGE_TAG} -f ./frontend/Dockerfile ./frontend"
      }
    }

    stage('Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
            docker push ${IMAGE}:${IMAGE_TAG}
            docker tag ${IMAGE}:${IMAGE_TAG} ${IMAGE}:latest
            docker push ${IMAGE}:latest
          '''
        }
      }
    }

    stage('Deploy') {
      steps {
        sshagent([SSH_CRED]) {
          sh """
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
              cd ${REMOTE_PROJECT_DIR} &&
              docker compose pull chat-frontend || true &&
              docker compose up -d chat-frontend
            '
          """
        }
      }
    }
  }
}
