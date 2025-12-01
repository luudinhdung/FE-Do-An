pipeline {
  options { 
    skipDefaultCheckout() 
    // Bạn có thể thêm timeout, buildDiscarder... nếu cần
  }

  agent any

  environment {
    IMAGE = 'dungsave123/chat-frontend'
    DOCKER_CRED = 'dockerhub-cred'   // usernamePassword
    SSH_CRED = 'gcp-ssh-key'         // ssh private key credential id
    REMOTE_USER = 'dinhtuanzzzaa'
    REMOTE_HOST = '35.188.81.254'
    REMOTE_PROJECT_DIR = '/home/dinhtuanzzzaa/chat-as'
  }

  stages {

    stage('Clean & Checkout') {
      steps {
        // đảm bảo workspace sạch để tránh state cũ gây lỗi "not in a git directory"
        deleteDir()

        // Checkout repo (chạy trên node, không trong container)
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/luudinhdung/FE-Do-An'
          ]]
        ])

        // tránh lỗi safe.directory khi Jenkins chạy dưới user khác
        sh 'git config --global --add safe.directory $WORKSPACE || true'

        // lưu short commit hash để làm image tag
        script {
          env.IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          echo "IMAGE_TAG=${env.IMAGE_TAG}"
        }
      }
    }

    stage('Build (Node)') {
      // build using node image (keeps docker CLI container lean)
      agent {
        docker {
          image 'node:20-alpine'
          // mount workspace so container can access checked-out code
          args '-u root:root -v $WORKSPACE:$WORKSPACE -w $WORKSPACE'
        }
      }
      steps {
        sh '''
          # ensure packages for alpine (optional)
          apk add --no-cache python3 make g++ || true

          echo "📦 Installing deps"
          npm ci --prefer-offline --no-audit

          echo "⚙️ Building"
          npm run build
        '''
      }
    }

    stage('Build & Push Docker Image') {
      // run docker CLI image and mount docker.sock + workspace
      agent {
        docker {
          image 'docker:27.0.3-cli'
          args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:$WORKSPACE -w $WORKSPACE'
        }
      }
      steps {
        // build image
        sh '''
          echo "🐳 Building Docker image ${IMAGE}:${IMAGE_TAG}"
          docker build --no-cache \
            --build-arg NEXT_PUBLIC_API_URL=https://chat-as.site \
            --build-arg NEXT_PUBLIC_ENCRYPTION_KEY=my-secret-system-key \
            -t ${IMAGE}:${IMAGE_TAG} .
        '''

        // login & push using credentials
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "📤 Logging in to Docker registry"
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

            echo "📤 Pushing ${IMAGE}:${IMAGE_TAG}"
            docker push ${IMAGE}:${IMAGE_TAG}

            echo "📌 Tagging & pushing latest"
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
            echo "🚀 Deploying to ${REMOTE_HOST}"
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
              set -e
              cd ${REMOTE_PROJECT_DIR} || exit 1
              docker compose pull frontend || true
              docker compose up -d --force-recreate frontend
            '
          """
        }
      }
    }
  }

  post {
    success {
      echo "✅ FE deployed successfully: ${IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "❌ FE Pipeline failed."
    }
  }
}
