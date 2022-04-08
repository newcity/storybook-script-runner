# Demo of Storybook Script-Runner with Twing and TypeScript

This repository demonstrates how to run pattern-level scripts with templates in Storybook. The template engine is [Twing](https://gitlab.com/nightlycommit/twing), which is a TypeScript port of [Twig](https://twig.symfony.com/).

The script-runner is `.storybook/script-runner.js`, and it gets imported by `.storybook/preview.js` on page-load in Storybook. It automatically executes each pattern-level script as needed, provided that the script default-exports its code as a function, and provided that it shares a name with a Twig file that lives in the same directory. The pattern-level scripts can be either JS or TS files. See `components/Example/Example.ts` and `components/Button/Button.ts` for examples.

There's also a pipeline set up to output the pattern-level scripts and the global styles to the `dist` directory (whose contents are _not_ under version control). Crucially, the pipeline strips the pattern-level scripts of their export-statements. The `npm start` command sets up watchers that keep `dist`'s contents up to date as you make changes, just so you can confirm that the pipeline is working correctly. In production, the `npm run build` command will build _minified_ versions of the same files (as long as `NODE_ENV` is set to `'production'`). We sometimes have the pipeline copy the Twig files over to `dist`, too; didn't bother with that in this demo.

With Twing, the Twig-templates are loaded as _async_ functions, and making this work with Storybook is a little tricky. See `.storybook/preview.js` for the details that are abstracted away (a global loader and a global render-function). See `components/Button/Button.stories.ts` and `components/Example/Example.stories.ts` for the part that _isn't_ abstracted away&mdash;namely, that each story's rendering logic must go in a `.parameters.render()` function that returns a Promise. Speaking of Promises, top-level `await` is enabled (see `.storybook/main.js` for how that's done). Note that this repo is using [CSF 3.0](https://storybook.js.org/blog/component-story-format-3-0/), so stories are themselves objects rather than functions.

In those `components/**/*.stories.ts` files, you'll see a clean separation of the "pure components" from the stories. By _pure component_ I mean a function that does nothing but bring the Twig template into the TypeScript ecosystem, passing it a _typed_ object-parameter. The story-rendering function always ultimately returns a call to the pure-component function, but it will often do more than that (e.g., provide some default values, or contain logic for handling input provided by the user in the [Controls](https://storybook.js.org/docs/react/essentials/controls)), so this clean separation is helpful, especially with the type-safety that TypeScript brings. Providing a type alias for the Twig-context also benefits the back-end developer, who should be able to read off of it exactly what properties the template needs.

The simplest approach to injecting templates into other templates is to use Twig's built-in mechanisms for that ([`include`](https://twig.symfony.com/doc/3.x/tags/include.html) and [`embed`](https://twig.symfony.com/doc/3.x/tags/embed.html)). Of course, you lose type safety that way, and some back-end developers prefer a different approach. If you'd instead like to handle some or all of the injections on the TypeScript side by passing one rendered template into another as a variable (a markup-string), then you can do so with the injected template's corresponding `.parameters.render()` function (or pure-component function), in which case you'll quickly appreciate that top-level `await` is enabled! A _downside_ of injecting templates like this is that you lose the ability to pass properties to the injected template directly from the Twig file that consumes it, and you must put _all_ of the logic for determining the injected template's properties in the TypeScript... which then must be replicated in PHP by the back-end developer. Usually this is fine, but occasionally it's burdensome (e.g., logic for determining the correct heading-level of a nested template is the kind of thing that I'd rather put in the consuming template than in the TypeScript and PHP). To get around this problem, my colleagues and I have devised a system of passing in components to the Twig files not as markup-strings but rather as _functions_ that _can_ accept additional properties on the Twig side, but this is a bit complicated and requires a custom Twig filter with different front- and back-end implementations, so I won't go into it here.

Since the `components/**/*.stories.ts` files are boilerplate-y, I typically add a [VS Code snippet](https://code.visualstudio.com/docs/editor/userdefinedsnippets) to my projects that developers can use to quickly generate a "skeleton" `.stories.ts` module. I haven't included one in this repo&mdash;our usual setups differ in some key ways from what's demoed here&mdash;but if you use a setup like this then I do recommend putting in the effort to make one.
