cd /opt/paperless
#cp paperless.conf.example paperless.conf
pyenv global 3.9.18
pyenv local 3.9.18
pipenv requirements > req.txt
pip install -r req.txt

cd /opt/paperless/src
python3 manage.py migrate
python3 manage.py createsuperuser

cd /opt/paperless/src-ui
npm i -g npm@latest --force
npm install -g @angular/cli
npm install
ng build --configuration production


cd /opt/paperless
git config --global --add safe.directory /opt/paperless
git config --global --add user.name "Muffaddal Kalla"
git config --global --add user.email "muf@bqa.la"