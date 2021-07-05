# webpack плагин

В репозитории помимо [самого плагина](https://github.com/Super-Cereal/webpackPlugin/blob/master/MarkUnusedFilesWebpackPlugin.js) лежат файлы, на которых я его тестировал.

- Сперва плагин собирает информацию о модулях, задействованных в сборке

- затем он узнает все модули в файловой системе

- выделяет не попавшие в сборку и записывает их в файл `unused.json` в output папку, указанную в `webpack.config`

Плагин по дефолту игнорирует некоторые файлы (такие как `package.json` или `webpack.config` или `.prettier`) и папки(`node_modules` и папку, указанную в output).

Кроме этого можно игнорировать и другие файлы и папки, достаточно только указать их паттерн как параметр `ignorePatterns`:

```JS
plugins: [
    new MarkUnusedFilesWebpackPlugin({ ignorePatterns: ["/pages"] }),
  ],
```
