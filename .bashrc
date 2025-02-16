export PYENV_ROOT="$HOME/.pyenv"
[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"
cd $HOME
eval "$(pyenv init -)" 


# Load Angular CLI autocompletion.
source <(ng completion script)
