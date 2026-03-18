# Zhiyang Liang Homepage

This directory now contains a minimal single-page personal homepage designed to be deployed directly with GitHub Pages.

## Files

- `index.html`: the homepage
- `files/site.css`: the stylesheet
- `img/avatar_new.png`: profile photo
- `img/zyliang_icon.png`: favicon
- `404.html`: redirect to homepage

## Local Preview

```bash
python3 -m http.server 8123
```

Then open `http://127.0.0.1:8123/`.

## Deploy To GitHub Pages

Push the contents of this directory to the `main` branch of `ZhiyangLiang/zhiyangliang.github.io`.

```bash
git init
git add .
git commit -m "Rebuild homepage as single-page site"
git branch -M main
git remote add origin git@github.com:ZhiyangLiang/zhiyangliang.github.io.git
git push -u origin main --force
```

If the repository already exists locally, just replace the files, commit, and push.
