pipeline {
  agent {
    docker {
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

    SONARQUBE_SERVER = 'SonarQube' // tên bạn config trong Manage Jenkins > System
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

    // 🧩 Thêm bước phân tích SonarQube
    stage('Code Analysis - SonarQube') {
      steps {
        withSonarQubeEnv("${SONARQUBE_SERVER}") {
          sh '''
            echo "🔍 Running SonarQube analysis..."
            sonar-scanner \
              -Dsonar.projectKey=chat-frontend \
              -Dsonar.projectName="Chat Frontend" \
              -Dsonar.sources=. \
              -Dsonar.projectVersion=${GIT_SHORT} \
              -Dsonar.host.url=$SONAR_HOST_URL
          '''
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build --no-cache -t ${IMAGE}:latest ."
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
