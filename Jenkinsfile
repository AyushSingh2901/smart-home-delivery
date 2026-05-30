pipeline {
    agent any

    environment {
        // Replace with your Docker Hub username/org
        DOCKER_HUB_USER   = 'yourdockerhubusername'
        
        // Image names
        CLIENT_IMAGE_NAME = 'smart-home-client'
        SERVER_IMAGE_NAME = 'smart-home-server'
        
        // Image tags
        BUILD_TAG         = "${env.BUILD_NUMBER}"
        
        // Jenkins Credentials ID configured with Docker Hub username/password
        DOCKER_CREDS_ID   = 'docker-hub-credentials'
    }

    stages {
        stage('Validate Environment') {
            steps {
                script {
                    echo "Starting build #${env.BUILD_NUMBER} for branch ${env.BRANCH_NAME ?: 'unknown'}"
                    sh 'docker --version'
                }
            }
        }

        stage('Build Client Image') {
            steps {
                echo 'Building Client Docker Image...'
                // Builds using client/Dockerfile in the client subdirectory context
                sh "docker build -t ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:${BUILD_TAG} -t ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:latest ./client"
            }
        }

        stage('Build Server Image') {
            steps {
                echo 'Building Server Docker Image...'
                // Builds using server/Dockerfile in the server subdirectory context
                sh "docker build -t ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:${BUILD_TAG} -t ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:latest ./server"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Logging in to Docker Hub and pushing images...'
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USER} --password-stdin"
                    
                    // Push Client Images
                    sh "docker push ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:latest"
                    
                    // Push Server Images
                    sh "docker push ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:${BUILD_TAG}"
                    sh "docker push ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:latest"
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Performing cleanup of local images...'
                // Clean up local tagged images to save disk space on the agent
                sh "docker rmi -f ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:${BUILD_TAG} || true"
                sh "docker rmi -f ${DOCKER_HUB_USER}/${CLIENT_IMAGE_NAME}:latest || true"
                sh "docker rmi -f ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:${BUILD_TAG} || true"
                sh "docker rmi -f ${DOCKER_HUB_USER}/${SERVER_IMAGE_NAME}:latest || true"
                
                // Optional: prune dangling images to free up space
                sh "docker image prune -f || true"
            }
        }
        success {
            echo "Successfully built and pushed images for Build #${env.BUILD_NUMBER}!"
        }
        failure {
            echo "Build #${env.BUILD_NUMBER} failed. Please check the logs."
        }
    }
}
