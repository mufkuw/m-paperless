su - paperless <<EOF

pipenv requirements > req.txt
pip install --upgrade pip
pip install --upgrade setuptools
pip install -r req.txt --force || exit
python3 -m nltk.downloader popular

cd /opt/paperless/src
python3 manage.py migrate
python3 manage.py createsuperuser


cd /opt/paperless/src-ui

curl -fsSL https://deb.nodesource.com/setup_22.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt-get install -y nodejs

sudo npm i -g npm@latest --force
sudo npm install -g @angular/cli
npm install --force
ng build --configuration production

cd /opt/paperless
git config --global --add safe.directory /opt/paperless
git config --global --add user.name "Muffaddal Kalla"
git config --global --add user.email "muf@bqa.la"

EOF

ln -s /opt/paperless/scripts/m-webserver.service /etc/systemd/system/m-webserver.service
ln -s /opt/paperless/scripts/m-webserver.socket /etc/systemd/system/m-webserver.socket
ln -s /opt/paperless/scripts/m-consumer.service /etc/systemd/system/m-consumer.service
ln -s /opt/paperless/scripts/m-queue.service /etc/systemd/system/m-queue.service
ln -s /opt/paperless/scripts/m-scheduler.service /etc/systemd/system/m-scheduler.service

systemctl daemon-reload
systemctl enable m-webserver m-consumer m-queue m-scheduler
systemctl start m-webserver m-consumer m-queue m-scheduler
