import { StoryObj, Parameters as Params, Meta } from '@storybook/html';
import ExampleTemplate from './Example.twig';
import { Button, ButtonPureComponent } from '../Button/Button.stories';

// should exactly match the context-signature of `Example.twig`
export type ExampleTwigContext = {
  foo: string;
  button3?: string;
  button4?: string;
  button5?: string;
};

// just renders the template; don't export it unless you really need to
const ExamplePureComponent = (twigContext: ExampleTwigContext) =>
  ExampleTemplate(twigContext);

export default { title: 'Example' } as Meta;


// Let's make some buttons to inject. Top-level await is available:

// story-function is usually more useful b/c of `...Button.args` pattern
const buttonFromStory = await Button.parameters.render({
  ...Button.args,
  text: 'Button 3'
});

// but pure-component function works too
const buttonFromPureComponent = await ButtonPureComponent({
  text: 'Button 4',
  color: 'rose'
});

const fooMakerOptions = ['bar', 'baz'] as const;

// the actual story
export const Example: IExample = {
  parameters: {
    render: async ({ fooMaker, withExtraButtons }) => {
      const foo = fooMaker === 'bar' ? 'BAR!' : 'BAZ!';

      const button3 = withExtraButtons ? buttonFromStory : undefined;
      const button4 = withExtraButtons ? buttonFromPureComponent : undefined;

      // if props are derived from args, must build injected piece here instead of top-level
      const button5 = withExtraButtons ? await Button.parameters.render({
        ...Button.args,
        text: `Foo: ${foo}`,
      }) : undefined;

      return ExamplePureComponent({
        foo,
        button3,
        button4,
        button5,
      });
    },
  },

  args: {
    fooMaker: 'bar',
    withExtraButtons: true,
  },

  argTypes: {
    fooMaker: {
      options: fooMakerOptions,
      control: {
        type: 'inline-radio',
      },
    },
  },
};

export type ExampleArgs = {
  fooMaker: typeof fooMakerOptions[number];
  withExtraButtons?: boolean;
};

export interface IExample extends StoryObj {
  args: Readonly<ExampleArgs>;
  parameters: Params & {
    render(this: void, args: Readonly<ExampleArgs>): Promise<string>;
  };
  render?: never;
}
