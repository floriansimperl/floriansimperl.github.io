# floriansimperl.github.io

One-page business template for GitHub Pages, inspired by the Illdy WordPress theme. Plain HTML, CSS and JS with no build step.

## Sections

Header, About, Statistics, Projects, References, Blog, Contact and Footer.

## Subsections
Projects and Blog have their separate pages.

## Customize

- **Content:** edit `index.html`. Each section is a `<section id="...">`.
- **Colors and fonts:** change the variables at the top of `assets/css/style.css`.
- **Images:** put files in `assets/img/`. Replace the gradient on `.hero` with `url("../img/hero.jpg") center/cover`.
- **Contact:** the contact section uses a `mailto:` button. GitHub Pages has no server, so a real form would need a service such as [Formspree](https://formspree.io).

## Preview locally

    python3 -m http.server 8000

Then open http://localhost:8000.

## Deploy

Push to `main`. In the repo's Settings > Pages, set the source to the `main` branch, root folder.

## License

See `LICENSE`.
