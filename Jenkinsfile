pipeline {
  agent {
    docker {
      image 'docker:27.0.3-cli'
      args '-v /var/run/docker.sock:/var/run/docker.sock -v /home/jenkins/.docker:/root/.docker'
    }
  } 

  environment {
    IMAGE = 'dungsave123/chat-frontend'
    DOCKER_CRED = 'dockerhub-cred'
    SSH_CRED = 'gcp-ssh-key'
    REMOTE_USER = 'dinhtuanzzzaa'
    REMOTE_HOST = '35.188.81.254'
    REMOTE_PROJECT_DIR = '/home/dinhtuanzzzaa/chat-as'
  }

  stages {
    stage('Prepare') {
      steps {
        sh 'git config --global --add safe.directory /var/jenkins_home/workspace/fe-pipeline'
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh """
          docker build --no-cache --pull \
            --build-arg NEXT_PUBLIC_API_URL=https://chat-as.site \
            --build-arg NEXT_PUBLIC_ENCRYPTION_KEY=my-secret-system-key \
            -t ${IMAGE}:latest .
        """
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
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
              docker compose down &&
              docker compose pull frontend &&
              docker compose up -d --force-recreate frontend
            '
          """
        }
      }
    }
  }
}
