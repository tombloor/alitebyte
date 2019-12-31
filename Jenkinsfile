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

    stage('copy') {
      steps {
        sh 'rsync -avzr ./_site/ /deploy/blog/'
      }
    }

  }
  environment {
    JEKYLL_ENV = 'production'
  }
}