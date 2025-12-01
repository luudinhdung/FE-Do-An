pipeline {

  options {
    skipDefaultCheckout()            // Tắt checkout mặc định
    durabilityHint('PERFORMANCE_OPTIMIZED')
    buildDiscarder(logRotator(numToKeepStr: '10'))
    timestamps()
  }

  agent {
    docker {
      image 'node:20-alpine'         // node + npm + Alpine → nhẹ, nhanh
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
        sh '''
          apk add --no-cache git
          git config --global --add safe.directory $WORKSPACE
        '''

        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/luudinhdung/FE-Do-An']]
        ])

        script {
          env.GIT_SHORT = sh(
            returnStdout: true,
            script: "git rev-parse --short HEAD"
          ).trim()

          env.IMAGE_TAG = env.GIT_SHORT
        }
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Fast Dependency Install (Cached)') {
      steps {
        sh '''
          echo "⚡ Using cached node_modules if exists..."
          
          if [ -d node_modules ]; then
            echo "node_modules already exists → skipping npm ci"
          else
            echo "Installing dependencies..."
            npm ci
          fi
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Build Next.js') {
      steps {
        sh '''
          echo "⚙️ Building Next.js Production..."
          npm run build
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Build Docker Image (Cached)') {
      steps {
        sh '''
          echo "🐳 Building Docker image with caching..."

          docker build \
            --build-arg NEXT_PUBLIC_API_URL=https://chat-as.site \
            --build-arg NEXT_PUBLIC_ENCRYPTION_KEY=my-secret-system-key \
            -t ${IMAGE}:${IMAGE_TAG} \
            -t ${IMAGE}:latest \
            .
        '''
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Push Image to DockerHub') {
      steps {
        withCredentials([usernamePassword(credentialsId: "${DOCKER_CRED}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "🔑 Logging in to DockerHub..."
            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

            echo "📤 Pushing image..."
            docker push ${IMAGE}:${IMAGE_TAG}
            docker push ${IMAGE}:latest
          '''
        }
      }
    }

    /* ─────────────────────────────────────────── */
    stage('Deploy to VM') {
      steps {
        sshagent([SSH_CRED]) {
          sh """
            echo "🚀 Deploying FE to VM..."
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
              cd ${REMOTE_PROJECT_DIR} &&
              docker compose pull frontend &&
              docker compose up -d --force-recreate frontend
            '
          """
        }
      }
    }

  }

  post {
    success {
      echo "🚀 Deployment successful: ${IMAGE}:${IMAGE_TAG}"
    }
    failure {
      echo "❌ Build failed!"
    }
  }
}
