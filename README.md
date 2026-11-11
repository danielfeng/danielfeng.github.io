# danielfeng.github.io

Source for https://danielfeng.github.io (Hexo 8 + hexo-theme-redefine, Gruvbox Dark palette).

- `source` branch: site source (this branch).
- `master` branch: generated site, written by GitHub Actions. Don't edit it by hand.
- Tag `legacy-2019`: the old Hexo 3.8 site before the 2026 revamp.

## Write a post

```bash
npm ci
npx hexo new "文章标题"      # creates source/_posts/文章标题.md
npx hexo server              # preview at http://localhost:4000
git add source/_posts && git commit -m "post: 文章标题" && git push origin source
```

Pushing to `source` runs `.github/workflows/deploy.yml`, which builds the site
and pushes it to `master`; GitHub Pages picks it up in a minute or two.

Theme settings: `_config.redefine.yml` (overrides on top of the npm package's defaults).
Gruvbox colours / small CSS fixes: `source/css/gruvbox.css`.
Banner and avatar are local SVGs in `source/images/`.
