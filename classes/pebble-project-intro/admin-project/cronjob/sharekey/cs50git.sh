function cs50git() {
    (
        eval $(ssh-agent -s)
        ssh-add "$HOME/.ssh/cs50-17s"
        git $@
    )
}
