# Prerequisites

Below are the prerequisites to have installed and configured in order to get the maximum value out of the workshop.

## SmartGit

Install [SmartGit](http://www.syntevo.com/smartgit/). Choose the Open Source (No Support) license option.

## GitVersion

Install [GitVersion](https://github.com/GitTools/GitVersion/releases/tag/v3.6.5).

## Terminal

Pick a good terminal if you haven't already.

<table>
    <tr>
        <th scope="row">Windows</th>
        <td>
            <a href="https://git-scm.com/downloads">Git Bash</a>,
            <a href="https://github.com/dahlbyk/posh-git">Posh-Git</a>
        </td>
    </tr>
    <tr>
        <th scope="row">macOS</th>
        <td><a href="https://www.iterm2.com/">iTerm2</a></td>
    </tr>
    <tr>
        <th scope="row">Linux</th>
        <td>N/A</td>
    </tr>
</table>

## Package Manager

Find a good package manager, if you haven't already.

<table>
    <tr>
        <th scope="row">Windows</th>
        <td><a href="https://chocolatey.org/">🍫</a></td>
    </tr>
    <tr>
        <th scope="row">macOS</th>
        <td><a href="https://brew.sh/">🍺</a></td>
    </tr>
    <tr>
        <th scope="row">Linux</th>
        <td>N/A</td>
    </tr>
</table>

## Install

Install Git with the package manager, or
[download and install it from git-scm.com](https://git-scm.com/downloads).

<table>
    <tr>
        <th scope="row">Windows</th>
        <td style="font-family: monospace">
            choco install git.install
        </td>
    </tr>
    <tr>
        <th scope="row">macOS</th>
        <td style="font-family: monospace">
            brew install git
        </td>
    </tr>
    <tr>
        <th scope="row">Linux</th>
        <td style="font-family: monospace">
            apt-get install git
        </td>
    </tr>
</table>

## Configuration

### Name and E-mail

```shell
# Is a user name configured?
git config --global user.name

# If not, configure a user name
git config --global user.name "Asbjørn Ulsberg"

# Is an e-mail address configured?
git config --global user.email

# If not, configure an e-mail address
git config --global user.email asbjorn.ulsberg@payex.com
```

### Editor

Editor Wars: Commence!

<table>
    <tr>
        <th scope="row">Windows</th>
        <td style="font-family: monospace;">
            git config --global core.editor notepad
        </td>
    </tr>
    <tr>
        <th scope="row">macOS</th>
        <td style="font-family: monospace">
            git config --global core.editor atom
        </td>
    </tr>
    <tr>
        <th scope="row">Linux</th>
        <td style="font-family: monospace">
            git config --global core.editor emacs
        </td>
    </tr>
</table>

### Conditional Config (Optional)

**Optional**: Change identity depending on where you are.

**Requires Git version 2.13 or higher.**

```ini
[user]
name = Asbjørn Ulsberg
email = asbjorn.ulsberg@payex.com

[includeIf "gitdir:~/projects/personal/"]
path = ~/.gitconfig.oss

# inside .gitconfig.oss:

[user]
email = asbjorn@ulsberg.com
```

### SSH (Optional)

**Optional**: Set up Git to use SSH and PKI.

SSH provides max efficiency, security and flexibility.

```shell
# Lists the files in your .ssh directory, if they exist:
ls -al ~/.ssh

# If not, generate a keypair
ssh-keygen -t rsa -b 4096 -C "asbjorn.ulsberg@payex.com"

# Complete the interactive key generation wizard.
# Then add the key to the SSH agent.
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa

# Copy the contents of the id_rsa.pub file:
cat ~/.ssh/id_rsa.pub
```

[Lastly, add the public key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-linux)
