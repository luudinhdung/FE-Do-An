pipeline {
  agent {
    docker {
      // Dùng image Docker CLI để build + mount socket
      image 'docker:27.0.3-cli'
      args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    IMAGE = 'dungsave123/chat-frontend'
    DOCKER_CRED = 'dockerhub-credentials'
    SSH_CRED = 'gcp-ssh-key'
    REMOTE_USER = 'dinhtuanzzzaa'
    REMOTE_HOST = '35.188.81.254'
    REMOTE_PROJECT_DIR = '/home/dinhtuanzzzaa/chat-as'
    SONARQUBE_SERVER = 'SonarQube'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
        script {
          env.GIT_SHORT = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv(SONARQUBE_SERVER) {
          sh '''
            echo "🔍 Running SonarQube analysis..."
            docker run --rm -v $(pwd):/usr/src \
              sonarsource/sonar-scanner-cli:latest \
              -Dsonar.projectKey=chat-frontend \
              -Dsonar.projectName="Chat Frontend" \
              -Dsonar.sources=. \
              -Dsonar.projectVersion=${GIT_SHORT} \
              -Dsonar.host.url=$SONAR_HOST_URL \
              -Dsonar.login=$SONAR_AUTH_TOKEN
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build  -t ${IMAGE}:latest ."
      }
    }

    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "🚀 Pushing image to Docker Hub..."
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
