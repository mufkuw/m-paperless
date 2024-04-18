apt update && apt upgrade -y
apt install sudo python3 python3-pip python3-dev imagemagick fonts-liberation gnupg libpq-dev default-libmysqlclient-dev pkg-config libmagic-dev mime-support libzbar0 poppler-utils unpaper ghostscript icc-profiles-free qpdf liblept5 libxml2 pngquant zlib1g tesseract-ocr tesseract-ocr-eng tesseract-ocr-ara build-essential python3-setuptools python3-wheel redis-server postgresql git nodejs npm build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python3-openssl libedit-dev libncurses5-dev curl pipenv gunicorn -y

curl https://pyenv.run | bash
curl https://get.docker.com/ | bash


export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH"

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init -)"' >> ~/.bashrc
pyenv install 3.9.18

rm -R /opt/paperless
adduser paperless --system --home /opt/paperless --group

git clone https://github.com/mufkuw/m-paperless.git /opt/mpls

mv /opt/paperless /opt/mmpls
mv /opt/mpls /opt/paperless
rm -R mmpls

chown -R paperless:paperless /opt/paperless

mkdir /opt/paperless/media
mkdir /opt/paperless/data
mkdir /opt/paperless/consume

sudo chown paperless:paperless /opt/paperless/media
sudo chown paperless:paperless /opt/paperless/data
sudo chown paperless:paperless /opt/paperless/consume

/opt/paperless/resources/plymouth/install.sh

docker run -d --restart=always -p 9998:9998 apache/tika:latest
docker run -d --restart=always -p 3000:3000 gotenberg/gotenberg:latest
