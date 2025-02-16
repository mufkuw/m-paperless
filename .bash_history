clear
sudo ln -s /opt/paperless/server.nginx.conf /etc/nginx/sites-enabled/paperless.conf
sudo rm /etc/nginx/sites-enabled/default
sudo chmod 777 /opt/paperless/update-ip.sh
ln -s /opt/paperless/scripts/m-webserver.service /etc/systemd/system/m-webserver.service
ln -s /opt/paperless/scripts/m-webserver.socket /etc/systemd/system/m-webserver.socket
ln -s /opt/paperless/scripts/m-consumer.service /etc/systemd/system/m-consumer.service
ln -s /opt/paperless/scripts/m-queue.service /etc/systemd/system/m-queue.service
ln -s /opt/paperless/scripts/m-scheduler.service /etc/systemd/system/m-scheduler.service
clear
su root
clear
ls
service m-webserver status
sudo systemctl status m-*
cd 
cd .pyenv
cd shims
ls
cd
clear
ls
clear
logout
exit
