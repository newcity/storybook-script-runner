const setUpExample = () => {
  console.log(
    'I am logged from `Example.ts.`'
    + '\nI should be printed every time you visit the Example story.'
    + '\nWhile viewing that story, try changing `Example.ts` and saving it.'
    + '\nThe story should re-render and then I should be logged again.'
  );
};

if (!(window as any).IS_STORYBOOK) setUpExample();
export default setUpExample;
