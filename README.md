# Next.js App Template

This is a Next.js app template configured with Prettier, ESLint, and Tailwind CSS. The repository also contains branches for additional setups like Jest and BiomeJS as the linter.

## Getting Started

First, clone the repository:

```bash
git clone https://github.com/haider-patanwala/nextjs-app-template.git
cd nextjs-app-template
```

or create new repository from template by clicking on the link below 👇

[nextjs-template](https://github.com/new?template_name=nextjs-template&template_owner=haider-patanwala "https://github.com/new?template_name=nextjs-template&template_owner=haider-patanwala")

Install the dependencies:

```
npm install
# or
yarn install
```

Run the development server:

```
npm run dev
# or
yarn dev
```

## Main Branch Setup

### Prettier

Prettier is configured to format your code. You can run it with:

### ESLint

ESLint is set up for linting your JavaScript/TypeScript code. You can run the linter with:

### Tailwind CSS

Tailwind CSS is configured for styling. You can start using it by adding classes to your components.

## Additional Branches

### Jest Setup

Switch to the `jest-setup` branch to get a setup with Jest for testing:

```
git checkout jest-setup
```

Install the dependencies:

Run the tests:

```
npm run test
# or
yarn test
```

### Playwright Setup

Switch to the `playwright-setup` branch to get a setup with Playwright for end-to-end testing:

```
git checkout playwright-setup

```

Run the tests:

```
# Build and run the project
npm run build
npm run start

# Open new terminal
npx playwright test
```

### BiomeJS as Linter

Switch to the `biomejs-setup` branch to use BiomeJS as the linter:

```
git checkout linter-biomejs
```

Install the dependencies:

Run the linter:

```
npx @biomejs/biome lint .
```

## Learn More

To learn more about Next.js, Prettier, ESLint, Tailwind CSS, Jest, and BiomeJS, take a look at the following resources:

- [Next.js Documentation]()
- [Prettier Documentation]()
- [ESLint Documentation]()
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation]()
- [BiomeJS Documentation]()

## Contributing

If you have suggestions or improvements, feel free to open an issue or submit a pull request.
