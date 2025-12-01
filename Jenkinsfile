pipeline {

  /* 🚨 BẮT BUỘC: Tắt checkout mặc định để tránh lỗi fatal: not in a git directory */
  options {
    skipDefaultCheckout(true)
  }

  agent {
    docker {
      image 'docker:27.0.3-cli'
      args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock'
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

    /* ─────────────────────────────────────────── */
    stage('Checkout') {
      steps {
        sh 'git config --global --add safe.directory $WORKSPACE'

        // Checkout repo FE (không dùng scm mặc định của Jenkins)
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/luudinhdung/FE-Do-An'
          ]]
        ])

        script {
          GIT_SHORT = sh(
            returnStdout: true,
            script: "git rev-parse --short HEAD"
          ).trim()

          env.IMAGE_TAG = "${GIT_SHORT}"
        }
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Install Dependencies') {
      steps {
        sh '''
          echo "📦 Installing Node.js 20 (for FE build)..."
          apk add --no-cache nodejs npm
          node -v
          npm -v

          echo "📦 Installing frontend dependencies..."
          npm ci
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Build Next.js Production') {
      steps {
        sh '''
          echo "⚙️ Building Next.js..."
          npm run build
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Build Docker Image') {
      steps {
        sh '''
          echo "🐳 Building Docker image for FE..."
          docker build \
            --no-cache \
            --build-arg NEXT_PUBLIC_API_URL=https://chat-as.site \
            --build-arg NEXT_PUBLIC_ENCRYPTION_KEY=my-secret-system-key \
            -t ${IMAGE}:${IMAGE_TAG} .
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "📤 Pushing images..."
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

            docker push ${IMAGE}:${IMAGE_TAG}
            docker tag ${IMAGE}:${IMAGE_TAG} ${IMAGE}:latest
            docker push ${IMAGE}:latest
          '''
        }
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Deploy') {
      steps {
        sshagent([SSH_CRED]) {
          sh """
            echo "🚀 Deploying FE on VM..."
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
              cd ${REMOTE_PROJECT_DIR} &&
              docker compose pull frontend || true &&
              docker compose up -d --force-recreate frontend
            '
          """
        }
      }
    }
  }

  /* ─────────────────────────────────────────── */
  post {
    success {
      echo "✅ FE deployed successfully: ${IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "❌ FE Pipeline failed."
    }
  }
}
