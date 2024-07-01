#!/bin/bash

apt update && apt upgrade -y
apt install sudo git -y

PAPERLESS_HOME='/opt/paperless'
mv $PAPERLESS_HOME $PAPERLESS_HOME$(date +%Y%m%d_%H%M%S).bak
git clone https://github.com/mufkuw/m-paperless.git $PAPERLESS_HOME

mkdir $PAPERLESS_HOME/media
mkdir $PAPERLESS_HOME/data
mkdir $PAPERLESS_HOME/consume

chown -R paperless:paperless $PAPERLESS_HOME

useradd -m -d $PAPERLESS_HOME -s /bin/bash paperless
usermod -aG sudo paperless
chown -R paperless:paperless $PAPERLESS_HOME

echo 'Please change the paperless password to proceed'
passwd paperless

sudo apt install sudo python3 python3-pip python3-dev imagemagick fonts-liberation gnupg libpq-dev default-libmysqlclient-dev\
 pkg-config libmagic-dev mime-support libzbar0 poppler-utils unpaper ghostscript icc-profiles-free qpdf liblept5 libxml2 \
 pngquant zlib1g tesseract-ocr tesseract-ocr-eng tesseract-ocr-ara build-essential python3-setuptools python3-wheel redis-server\
 postgresql git nodejs npm build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev \
 libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl libedit-dev libncurses5-dev curl pipenv gunicorn celery nginx -y

rm -R $PAPERLESS_HOME/.pyenv
sudo -u paperless bash -c 'curl https://pyenv.run | bash'

echo 'export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
cd $HOME
eval "$(pyenv init -)"'\ >> $PAPERLESS_HOME/.bash_profile

echo 'export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
cd $HOME
eval "$(pyenv init -)"'\ >> $PAPERLESS_HOME/.bashrc

export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

chown paperless:paperless $PAPERLESS_HOME/.bashrc
chown paperless:paperless $PAPERLESS_HOME/.bash_profile

su paperless -l -c 'pyenv install 3.11.6 && exit'

chmod 766 $PAPERLESS_HOME/resources/plymouth/install.sh
source $PAPERLESS_HOME/resources/plymouth/install.sh

curl https://get.docker.com/ | sudo -u paperless bash

sudo ln -s /opt/paperless/server.nginx.conf /etc/nginx/sites-enabled/paperless.conf
sudo rm /etc/nginx/sites-enabled/default
sudo chmod 777 /opt/paperless/update-ip.sh

sudo docker run -d --restart=always -p 9998:9998 apache/tika:latest
sudo docker run -d --restart=always -p 3000:3000 gotenberg/gotenberg:latest

# Loop through all matching policy.xml files in /etc/ImageMagick-*
for file in /etc/ImageMagick-*/policy.xml; do
  # Use sed to replace the line
  sed -i 's|<policy domain="coder" rights="none" pattern="PDF" />|<policy domain="coder" rights="read\|write" pattern="PDF" />|' "$file"
done

sudo cp /opt/paperless/resources/tessdata/*.traineddata  $(find /usr/share | grep -m 1 \/tessdata)
