import { StoryObj, Parameters as Params, Meta } from '@storybook/html';
import ButtonTemplate from './Button.twig';

// should exactly match the context-signature of `Button.twig`
export type ButtonTwigContext = {
  text: string;
  color?: 'rose' | 'slate';
};

// just renders the template; exporting b/c we use it in `Example.stories.ts`,
export const ButtonPureComponent = (twigContext: ButtonTwigContext) =>
  ButtonTemplate(twigContext);

export default {
  title: 'Button',
  // if pure-component is exported, this is necessary
  excludeStories: ['ButtonPureComponent'],
} as Meta;

// the actual story
export const Button: IButton = {
  parameters: {
    render: ({ text, alt }) => {
      const color = alt ? 'rose' : 'slate';
      return ButtonPureComponent({ text, color });
    },
  },

  args: {
    text: 'I am a button',
    alt: true,
  },

  decorators: [
    story => /* html */ `<div class="p-10">${story()}</div>`,
  ],
};

export type ButtonArgs = {
  text: string;
  alt?: boolean;
};

export interface IButton extends StoryObj {
  args: Readonly<ButtonArgs>;
  parameters: Params & {
    render(this: void, args: Readonly<ButtonArgs>): Promise<string>;
  };
  render?: never;
}
