# The meat of the workshop
## Command Line Init

Let's init on the command line first.

```shell
mkdir test
cd test
git init
echo '# Test 2'>readme.md
git status # Open SmartGit too
git add readme.md
git status # Open SmartGit too
git commit -m 'Initial commit'
echo 'This is the repository of Test 2'>>readme.md
git status # Open SmartGit too
git commit -am 'Added description to readme'
git checkout -b feature/blurp
ls -la .git/refs/heads/
ls -la .git/refs/heads/feature/
cat .git/refs/heads/feature/blurp
echo '# Blurp'>blurp.md
echo '[Here is the blurp](blurp.md)'>>readme.md
git status # Open SmartGit too
git add .
git status # Open SmartGit too
git show readme.md # show the staged content
git commit -m 'Added the blurp'
git checkout master
gitversion # 0.0.1
echo 'Conflict!'>>readme.md
git commit -am 'Added conflict'
git merge feature/blurp
```

Resolve merge conflict in SmartGit.

```shell
git diff --cached
git commit --no-edit
git tag 1.0
git show # show the last commit
gitversion # 1.0.0
```

Explain how this process is called GitHubFlow, only using feature branches.

```shell
git checkout -b develop
echo "I'm on devlop now">>readme.md
git add .
nano readme.md # fix the typo
git status # Note that the file is both staged and modified at the same time
git add .
git status # Open SmartGit too
git commit -m 'Develop!'
gitversion # 1.1.0-unstable.1
echo 'More devlopment'>>readme.md
git add .
git show :readme.md # show how readme.md looks like in the staging area/index
git commit -m 'More devlopment'
nano readme.md # fix the typo
git add readme.md
git commit --amend -m 'More development' # also fix the commit message typo
```

Show the SmartGit "Recyclable Commits".

```shell
git reflog
```

1. See, everything is safe. Commits without child commits or
   references will be deleted when git does GC.
2. `git gc` will wait until `gc.reflogexpire` (default 90 days)
   before a commit is no longer reachable from the reflog and
   thus will be removed from history.

```shell
git checkout master
git merge develop # show that it does a ff
cat .git/refs/heads/master
git show-ref master
git show-ref develop # explain how develop and master points at the same commit, also show in SmartGit
git reset HEAD~1
git diff
```

- Explain difference between --mixed (default), --soft and --hard:
  1. --soft: what was commited is put back into the index.
  2. --mixed: changes are in the working tree, but not the index.
  3. --hard: changes are wiped

```shell
git reset --hard HEAD~1
git merge --no-ff develop
git show-ref master
git show-ref develop
```

1. Create a new repository on GitHub
2. Explain how we can't add anything to it since we're going to push.

```shell
git remote add origin git@github.com:asbjornu/test.git
git push --set-upstream origin master
```

Show the result on GitHub.

```shell
git checkout develop
git push
```

Enable branch protection, including for administrators.

```shell
echo 'Illegal'>>readme.md
git commit -am 'This is illegal'
git push # GitHub will reject this push
git reset --hard HEAD~1
```

```shell
git checkout -b feature/derp
gitversion # 1.1.0-derp.1
```

[We need a file of a certain size for Git rename detection to work][1].

```shell
printf "Lorem ipsum dolor sit amet, velit urbanitas mea an,\nhas in dicam albucius salutatus. Has eu iuvaret verterem,\nipsum voluptua reformidans sea no.">>blurp.md

git commit -am 'Added Lorem Ipsum'

printf "# Blurp\nLorem ipsum est mutat scripserit cu, velit urbanitas mea an,\neu epicurei atomorum his, est mutat scripserit cu\nhas in prompta persequeris ut. Has eu elaboraret verterem,\nipsum voluptua reformidans sea no.\nCu salutatus definitionem sea, prompta persequeris ut his.">blurp.md
```

Show how you can add inner-line, hunk and selection staging in SmartGit.

```shell
git commit -m 'Rewrote Lorem Ipsum'
mv blurp.md derp.md
git status # Also show in SmartGit
git add .  # Add performs rename detection, while SmartGit does it directly in the working directory
git status # Explain the rename algorithm.
ruby -e 'a=STDIN.readlines;10.times do;b=[];5.times do; b << a[rand(a.size)].chomp end; puts b.join(" "); end' < /usr/share/dict/words > derp.md
git status # As what's staged is still identical, Git still has the file as 'renamed'
git add .
git status # Since more than 50% of the file now moved, Git no longer detects the rename.
```

Stage the new file with old content in SmartGit so Git detects the rename.

```shell
git commit -m 'Renamed blurp to derp'
git commit -am 'Added derping content'
git checkout develop
git merge --no-ff --no-edit feature/derp
git checkout master
git merge --no-ff --no-edit develop
git tag 1.1
gitversion # 1.1.0
```

1. Show SmartGit log with all branches checked.
2. Explain that this process is called Git Flow.

## Clone A New GitHub Repository

Let's create a GitHub repository first, then clone it.

1. Create repository on GitHub
2. Explain README, gitignore and license
3. Click clone, choose SSH/HTTPS depending on whether SSH is set up correctly.

```shell
git clone git@github.com:asbjornu/test2.git
```

Cloning from GitHub sets up the origin.

## Fork A Repository

Let's fork a repository!

- Find a repository with [gitrandom.com][2].
- Fork it

```shell
git clone $repo
cd $repo
```

- Delete the fork.

## Pull Request Time!

Let's do a pull request.

1.  Fork the [github.com/PayEx/ndcoslo2017][3] training repository.
2.  Start by creating a branch in SmartGit: Branch > Add Branch > Add Branch &amp; Checkout.
3.  Edit readme.md and create a new file.
4.  Show how the selection in SmartGit affects what you're committing.
5.  Stage readme.md
6.  Show how you can alter between "Staged changes" and "Local changes" in the commit window.
7.  Check both files and commit
8.  Push with SmartGit
9.  Go to GitHub and show the PR suggestion
10. Create the pull request
11. Close the pull request
12. Delete the branch
13. Show how the branch still exists locally
14. Push the branch again
15. Checkout master
16. Delete the local branch
17. Delete the remote branch
18. Create a new branch
19. Do whatever and submit a new pull request
20. Wait a while and select 3 random winners of SmartGit licenses:

```shell
echo $RANDOM % 10 + 1 | bc
```

[1]: https://github.com/libgit2/libgit2/issues/2735#issuecomment-64989769
[2]: https://gitrandom.com/
[3]: https://github.com/payex/ndcoslo2017
