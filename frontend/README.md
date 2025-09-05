# react + typescript + vite

this template provides a minimal setup to get react working in vite with hmr and some eslint rules.

currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [babel](https://babeljs.io/) for fast refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [swc](https://swc.rs/) for fast refresh

## expanding the eslint configuration

if you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalignores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // other configs...

      // remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedtypechecked,
      // alternatively, use this for stricter rules
      ...tseslint.configs.stricttypechecked,
      // optionally, add this for stylistic rules
      ...tseslint.configs.stylistictypechecked,

      // other configs...
    ],
    languageoptions: {
      parseroptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigrootdir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

you can also install [eslint-plugin-react-x](https://github.com/rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for react-specific lint rules:

```js
// eslint.config.js
import reactx from 'eslint-plugin-react-x'
import reactdom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalignores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // other configs...
      // enable lint rules for react
      reactx.configs['recommended-typescript'],
      // enable lint rules for react dom
      reactdom.configs.recommended,
    ],
    languageoptions: {
      parseroptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigrootdir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
