pipeline {
  agent {
    docker {
      image 'ruby:2.7'
    }

  }
  stages {
    stage('install gems') {
      steps {
        sh 'bundle install'
      }
    }

    stage('build') {
      steps {
        sh 'bundle exec jekyll build'
      }
    }

  }
  environment {
    JEKYLL_ENV = 'production'
  }
}