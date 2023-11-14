cd /opt/paperless
#cp paperless.conf.example paperless.conf
pyenv global 3.9.18
pyenv local 3.9.18

pipenv requirements > req.txt
#pip install -r req.txt
sudo -Hu paperless pip3 install -r req.txt --break-system-packages

cd /opt/paperless/src
sudo -Hu paperless python3 manage.py migrate
sudo -Hu paperless python3 manage.py createsuperuser

cd /opt/paperless/src-ui
npm i -g npm@latest --force
npm install -g @angular/cli
npm install
ng build --configuration production


cd /opt/paperless
git config --global --add safe.directory /opt/paperless
git config --global --add user.name "Muffaddal Kalla"
git config --global --add user.email "muf@bqa.la"

ln -s /opt/paperless/scripts/m-webserver.service /etc/systemd/system/m-webserver.service
ln -s /opt/paperless/scripts/m-webserver.socket /etc/systemd/system/m-webserver.socket
ln -s /opt/paperless/scripts/m-consumer.service /etc/systemd/system/m-consumer.service
ln -s /opt/paperless/scripts/m-queue.service /etc/systemd/system/m-queue.service
ln -s /opt/paperless/scripts/m-scheduler.service /etc/systemd/system/m-scheduler.service

systemctl enable m-webserver m-consumer m-queue m-scheduler
systemctl start m-webserver m-consumer m-queue m-scheduler

