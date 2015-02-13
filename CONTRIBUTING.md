# Contributing

## Workflow

  1. [Fork](https://help.github.com/articles/fork-a-repo/) the project
  2. Clone your fork to your local machine
     ```bash
     git clone git@githhub.com:<username>/<project>.git
     ```
  3. If you cloned a while ago, get the latest changes from upstream
     ```bash
     git checkout master
     get pull upstream master
     ```
  4. Create a [topic branch](https://help.github.com/articles/branching-out/#branches) to contain your change
     ```bash
     git checkout -b topic-branch
     ```

  5. Do development / make commits on your topic branch
  6. Ensure your changes pass testing
     ```bash
     npm test
     ```
  7. Create a [pull request](https://help.github.com/articles/using-pull-requests/) from your topic branch to this repository.

## Acknowledgements

Parts of this guide adapted from
[jekyll's contribution guide](https://github.com/jekyll/jekyll/blob/master/CONTRIBUTING.markdown)
and [livestream-twitch-gui's contribution guide](https://github.com/bastimeyer/livestreamer-twitch-gui/blob/master/CONTRIBUTING.md)
