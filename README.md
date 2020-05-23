# The Smart Super List

This is a website I've built where users can view an up-to-date list of 
low-fee super funds that invest in low-fee index funds. After spending 
hours of research and not finding a lot of information, I wanted to share 
that knowledge with others to help save them the time and effort I'd 
already invested. As a bonus, it was a good way to experiment with 
Firebase's Static File Hosting Service, Amazon Route 53, and SEO.

The website url is found at https://www.thesmartsuperlist.com/.

## How to run locally

```
the-smart-super-list$ nvm use v10.20.1 # If using v12+, gulp won't work unless using npm-force-resolutions fix in https://stackoverflow.com/a/58394828 
the-smart-super-list$ npm install
the-smart-super-list$ npm install --global gulp-cli
the-smart-super-list$ gulp dev
```

## How to serve and test Firebase project locally

```
$ firebase serve --only hosting
```

## How to deploy the site

```
$ firebase deploy --only hosting -m "This is a deployment comment"
```
