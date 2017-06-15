                    <ol>
                        <li><a href="http://www.bbc.com/earth/story/20150924-the-truth-about-pigs">Dirty Pig</a></li>
                        <li>
                            Let's init on the command line first.
                            <ol>
                                <li>
<pre><code>
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

# Resolve merge conflict in SmartGit

git diff --cached
git commit --no-edit
git tag 1.0
git show # show the last commit
gitversion # 1.0.0

# Explain how this process is called GitHubFlow, only using feature branches.

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

# Show the SmartGit "Recyclable Commits"

git reflog # See, everything is safe. Commits without child commits or references will be deleted when git does GC.

# git gc will wait until 'gc.reflogexpire' (default 90 days) before a commit is
# no longer reachable from the reflog and thus will be removed from history.

git checkout master
git merge develop # show that it does a ff
cat .git/refs/heads/master
git show-ref master
git show-ref develop # explain how develop and master points at the same commit, also show in SmartGit
git reset HEAD~1
git diff

# explain difference between --mixed (default), --soft and --hard:
# --soft: what was commited is put back into the index.
# --mixed: changes are in the working tree, but not the index.
# --hard: changes are wiped

git reset --hard HEAD~1
git merge --no-ff develop
git show-ref master
git show-ref develop
</code></pre>
                                </li>
                                <li>Create a new repository on GitHub</li>
                                <li>
                                    Explain how we can't add anything to it
                                    since we're going to push.
                                </li>
<pre><code>
git remote add origin git@github.com:asbjornu/test.git
git push --set-upstream origin master
</code></pre>
                                </li>
                                <li>Show the result on GitHub</li>
                                <li>
<pre><code>
git checkout develop
git push
</code></pre>
                                </li>
                                <li>Enable branch protection, including for administrators</li>
                                <li>
<pre><code><![CDATA[
echo 'Illegal'>>readme.md
git commit -am 'This is illegal'
git push # GitHub will reject this push
git reset --hard HEAD~1

git checkout -b feature/derp
gitversion # 1.1.0-derp.1

# We need a file of a certain size for Git rename detection to work
# https://github.com/libgit2/libgit2/issues/2735#issuecomment-64989769

printf "Lorem ipsum dolor sit amet, velit urbanitas mea an,\nhas in dicam albucius salutatus. Has eu iuvaret verterem,\nipsum voluptua reformidans sea no.">>blurp.md
git commit -am 'Added Lorem Ipsum'

printf "# Blurp\nLorem ipsum est mutat scripserit cu, velit urbanitas mea an,\neu epicurei atomorum his, est mutat scripserit cu\nhas in prompta persequeris ut. Has eu elaboraret verterem,\nipsum voluptua reformidans sea no.\nCu salutatus definitionem sea, prompta persequeris ut his.">blurp.md

# Show how you can add inner-line, hunk and selection staging in SmartGit

git commit -m 'Rewrote Lorem Ipsum'
mv blurp.md derp.md
git status # Also show in SmartGit
git add .  # Add performs rename detection, while SmartGit does it directly in the working directory
git status # Explain the rename algorithm.
ruby -e 'a=STDIN.readlines;10.times do;b=[];5.times do; b << a[rand(a.size)].chomp end; puts b.join(" "); end' < /usr/share/dict/words > derp.md
git status # As what's staged is still identical, Git still has the file as 'renamed'
git add .
git status # Since more than 50% of the file now moved, Git no longer detects the rename.

# Stage the new file with old content in SmartGit so Git detects the rename

git commit -m 'Renamed blurp to derp'
git commit -am 'Added derping content'

git checkout develop
git merge --no-ff --no-edit feature/derp
git checkout master
git merge --no-ff --no-edit develop
git tag 1.1
gitversion # 1.1.0
]]></code></pre>
                                </li>
                                <li>Show SmartGit log with all branches checked</li>
                                <li>Explain that this process is Git Flow</li>
                            </ol>
                        </li>
                        <li>
                            Let's create a GitHub repository first, then clone it.
                            <ol>
                                <li>Create repository on GitHub</li>
                                <li>Explain README, gitignore and license</li>
                                <li>
                                    Click clone, choose SSH/HTTPS depending on
                                    whether SSH is set up correctly.
                                </li>
                                <li>git clone git@github.com:asbjornu/test2.git</li>
                                <li>Cloning from GitHub sets up the origin</li>
                            </ol>
                        </li>
                        <li>
                            Let's fork a repository!
                            <ol>
                                <li>
                                    Find a repository with
                                    <a href="https://gitrandom.com/">Git Random</a>.
                                </li>
                                <li>Fork it</li>
                                <li>
                                    <pre><code>git clone $repo
cd $repo
</code></pre>
                                </li>
                                <li>Delete the fork</li>
                            </ol>
                        </li>
                        <li>
                            Let's do a pull request
                            <ol>
                                <li>
                                    Fork the
                                    <a href="https://github.com/payex/ndcoslo2017">
                                        NDC Oslo 2017 training repository
                                    </a>
                                </li>
                                <li>
                                    Start by creating a branch.
                                    In SmartGit: Branch > Add Branch > Add Branch &amp; Checkout.
                                </li>
                                <li>Edit readme.md and create a new file.</li>
                                <li>
                                    Show how the selection in SmartGit affects what
                                    you're committing
                                </li>
                                <li>Stage readme.md</li>
                                <li>
                                    Show how you can alter between "Staged changes"
                                    and "Local changes" in the commit window.
                                </li>
                                <li>Check both files and commit</li>
                                <li>Push with SmartGit</li>
                                <li>Go to GitHub and show the PR suggestion</li>
                                <li>Create the pull request</li>
                                <li>Close the pull request</li>
                                <li>Delete the branch</li>
                                <li>Show how the branch still exists locally</li>
                                <li>Push the branch again</li>
                                <li>Checkout master</li>
                                <li>Delete the local branch</li>
                                <li>Delete the remote branch</li>
                                <li>Create a new branch</li>
                                <li>Do whatever and submit a new pull request</li>
                            </ol>
                        </li>
                    </ol>