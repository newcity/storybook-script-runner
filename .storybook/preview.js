import './script-runner';
import '../global-styles/tailwind.css';

export const loaders = [
  async ({ args, parameters }) => {
    const renderedStory = await parameters.render(args);
    return { renderedStory };
  },
];

export const render = (_, { loaded: { renderedStory } }) => renderedStory;

export const parameters = {
  layout: 'fullscreen',

  // necessary (for now) b/c inline docs are incompatible w/ loaders: https://github.com/storybookjs/storybook/issues/12726
  docs: {
    inlineStories: false,
    iframeHeight: 800,
  },
};
