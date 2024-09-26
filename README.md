# Playtron Labs App

Playtron Labs

## Technologies

All technologies used are listed in the Dependencies.MD file, here are the most important ones used by this project:

- Tauri - https://tauri.app/
- Vite - https://vitejs.dev/
- ReactJS - https://react.dev/
- Lingui - https://lingui.dev
- Typescript - https://www.typescriptlang.org/

## Setup

The app has two processes, the UI which is compiled and served using vite, and the main process that communicates with the OS native layer to launch the app using the Tauri rust backend.
UI: `./src`
Backend: `./src-tauri`

#### Playtron OS rpm-ostree dev dependencies

To compile this tauri app in a silverblue environment you'll need a couple dependencies that can be layered with rpm-ostree:
`sudo rpm-ostree install libsoup-devel webkit2gtk4.1-devel javascriptcoregtk4.1-devel gcc --apply-live`

### Conventions and guidelines for contributors

Please read the [guidelines](./Guidelines.MD) document when contributing to the project.

### Translations

This project has lingui setup for translations.
With lingui we can use the `t` or `Trans` macros from `@lingui/macro` to generate translation keys on the go, without having to manually define a translation file.

#### Adding new text

When adding text to the app please wrap it in one of these macros to make it ready for i18n:

##### With `t`:

```
import { t } from "@lingui/macro";

export default function TestComponent() {
  return <div>{t`My internationalized text`}</div>;
}
```

The `t` macro can also be used outside React components.

With `Trans`:

```
import { Trans } from "@lingui/macro"
export default function TestComponent() {
  return (
    <div>
      <Trans>`My internationalized text`</Trans>
    </div>;
  );
}

```

After that you can run `pnpm translations:extract` to automatically generate translations keys for all locales (this will be added to the locale messages.po file). The generated .po file is ready for translators to work with, being supported by most translation tools used by translations.
The .po files are automatically compiled by vite during the build, and are loaded dynamically: see https://lingui.dev/guides/dynamic-loading-catalogs

With the basic information above you should already be able to use this i18n library, more information can be found here: [Lingui React Patterns](https://lingui.dev/tutorials/react-patterns).

## Releases

The pipeline in this repo will automatically build and upload the installers to the github releases once code is merged to the main branch.
To change the version of the release, please update `package.json`

## Available Scripts

In the project directory, you can run:

### `pnpm start`

Runs the app in the development mode.
All this command does is run `tauri dev`

### `pnpm dev`

Command used by Tauri to start Vite dev server when running `tauri dev`

### `pnpm build`

Command used by Tauri to build code with Vite when running `tauri build`

### `pnpm tauri`

Access the Tauri cli commands. To see a list of available commands run `pnpm tauri help`

### `pnpm test`

Launches the test runner to run tests.
https://jestjs.io/docs/tutorial-react

### `pnpm test:watch`

Launches the test runner to run tests in watch mode.
https://jestjs.io/docs/tutorial-react

### `pnpm test:coverage`

Launches the test runner to run tests and produces a coverage report.

### `pnpm lint`

Lints the project and reports on the warnings/errors found.
For more information, see [eslint](https://eslint.org/docs/latest/).

### `pnpm generate`

Starts a CLI helper to generate components.

### `pnpm translations:extract`

Update catalogs with new messages.

For more information, see [lingui](https://lingui.dev/tutorials/cli#extracting-messages)
