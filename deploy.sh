git checkout master
git pull
JEKYLL_ENV=production bundle exec jekyll build
rsync -avz _site/ root@alitebyte.com:/var/www/alitebyte.com/html/