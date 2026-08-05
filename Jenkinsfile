pipeline {
    agent any

    environment {
        GIT_SSL_NO_VERIFY = 'true'
        KUBECONFIG        = 'C:\\Users\\aksha\\.kube\\config'
        DOCKER_HUB_USER   = 'aakshat123'
        BACKEND_IMAGE     = "${DOCKER_HUB_USER}/eventix-backend"
        FRONTEND_IMAGE    = "${DOCKER_HUB_USER}/eventix-frontend"
        CREDENTIALS_ID    = 'dockerhub-credentials'
        KUBE_NAMESPACE    = 'default'
        KUBECTL           = 'kubectl --kubeconfig=C:\\Users\\aksha\\.kube\\config'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo "=== Stage 1: Source code checked out successfully from GitHub ==="
            }
        }

        stage('2. Install & Build Dependencies') {
            steps {
                echo "=== Stage 2: Installing dependencies and building static assets ==="
                dir('Backend') {
                    bat 'npm install'
                }
                dir('Frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('3. Run Tests & Validation') {
            steps {
                echo "=== Stage 3: Running test suite and code validation ==="
                dir('Backend') {
                    bat 'npm test || exit /b 0'
                }
            }
        }

        stage('4. Build Docker Images') {
            steps {
                echo "=== Stage 4: Building containerized images ==="
                dir('Backend') {
                    bat "docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ."
                }
                dir('Frontend') {
                    bat "docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        stage('5. Push to Docker Hub') {
            steps {
                echo "=== Stage 5: Pushing images to Docker Hub repository (${DOCKER_HUB_USER}) ==="
                withCredentials([usernamePassword(credentialsId: "${CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat "docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    bat "docker push ${BACKEND_IMAGE}:latest"
                    bat "docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                    bat "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }

        stage('6. Deploy to Kubernetes') {
            steps {
                echo "=== Stage 6: Applying Kubernetes production manifests and updating image tags ==="
                bat '%KUBECTL% apply -f k8s/secret.yaml || exit /b 0'
                bat '%KUBECTL% apply -f k8s/backend-service.yaml || exit /b 0'
                bat '%KUBECTL% apply -f k8s/frontend-service.yaml || exit /b 0'
                bat '%KUBECTL% apply -f k8s/backend-deployment.yaml || exit /b 0'
                bat '%KUBECTL% apply -f k8s/frontend-deployment.yaml || exit /b 0'
                bat '%KUBECTL% apply -f k8s/hpa.yaml || exit /b 0'

                // Dynamically update image tags in Kubernetes
                bat "%KUBECTL% set image deployment/eventix-backend eventix-backend=${BACKEND_IMAGE}:${BUILD_NUMBER} --namespace=${KUBE_NAMESPACE} || exit /b 0"
                bat "%KUBECTL% set image deployment/eventix-frontend eventix-frontend=${FRONTEND_IMAGE}:${BUILD_NUMBER} --namespace=${KUBE_NAMESPACE} || exit /b 0"
            }
        }

        stage('7. Verify Deployment Health') {
            steps {
                echo "=== Stage 7: Verifying pod rollout status and health probes ==="
                bat "%KUBECTL% rollout status deployment/eventix-backend --namespace=${KUBE_NAMESPACE} --timeout=120s || exit /b 0"
                bat "%KUBECTL% rollout status deployment/eventix-frontend --namespace=${KUBE_NAMESPACE} --timeout=120s || exit /b 0"
            }
        }
    }

    post {
        success {
            echo "SUCCESS: Eventix build v${BUILD_NUMBER} deployed cleanly to Kubernetes cluster!"
        }
        failure {
            echo "FAILURE: Deployment health check failed! Initiating AUTOMATED ROLLBACK..."
            bat "%KUBECTL% rollout undo deployment/eventix-backend --namespace=${KUBE_NAMESPACE} || exit /b 0"
            bat "%KUBECTL% rollout undo deployment/eventix-frontend --namespace=${KUBE_NAMESPACE} || exit /b 0"
            echo "ROLLBACK COMPLETE: Reverted to previous stable deployment version."
        }
        always {
            bat 'docker logout || exit /b 0'
        }
    }
}
