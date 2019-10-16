git checkout master
git pull
bundle exec jekyll build
rsync -avz _site/ root@alitebyte.com:/var/www/alitebyte.com/html/