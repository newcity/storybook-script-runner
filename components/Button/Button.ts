const setUpButton = () => {
  console.log(
    'I am logged from `Button.ts` whenever `Button.twig` is rendered.'
    + '\nI should only be logged once, no matter how many buttons there are!'
    + '\nNote that this works regardless of how `Button.twig` ended up in the story.'
  );
};

if (!(window as any).IS_STORYBOOK) setUpButton();
export default setUpButton;