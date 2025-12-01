pipeline {
  options { 
    skipDefaultCheckout() 
  }

  agent any

  environment {
    IMAGE = 'dungsave123/chat-frontend'
    DOCKER_CRED = 'dockerhub-cred'
    SSH_CRED = 'gcp-ssh-key'
    REMOTE_USER = 'dinhtuanzzzaa'
    REMOTE_HOST = '35.188.81.254'
    REMOTE_PROJECT_DIR = '/home/dinhtuanzzzaa/chat-as'
  }

  stages {

    stage('Clean & Checkout') {
      steps {
        deleteDir()
        checkout([
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/luudinhdung/FE-Do-An'
          ]]
        ])
        sh 'git config --global --add safe.directory $WORKSPACE || true'
        script {
          env.IMAGE_TAG = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          echo "IMAGE_TAG=${env.IMAGE_TAG}"
        }
      }
    }

    stage('Build (Node)') {
      agent {
        docker {
          image 'node:20-alpine'
          args '-u root:root -v $WORKSPACE:$WORKSPACE -w $WORKSPACE'
        }
      }
      steps {
        sh '''
          apk add --no-cache python3 make g++ || true

          echo "📦 Installing deps"
          if [ -f package-lock.json ]; then
            npm ci --prefer-offline --no-audit
          else
            npm install --prefer-offline --no-audit
          fi

          echo "⚙️ Building"
          npm run build
        '''
      }
    }

    stage('Build & Push Docker Image') {
      agent {
        docker {
          image 'docker:27.0.3-cli'
          args '-u root:root -v /var/run/docker.sock:/var/run/docker.sock -v $WORKSPACE:$WORKSPACE -w $WORKSPACE'
        }
      }
      steps {
        sh '''
          echo "🐳 Building Docker image ${IMAGE}:${IMAGE_TAG}"
          docker build --no-cache \
            --build-arg NEXT_PUBLIC_API_URL=https://chat-as.site \
            --build-arg NEXT_PUBLIC_ENCRYPTION_KEY=my-secret-system-key \
            -t ${IMAGE}:${IMAGE_TAG} .
        '''
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
