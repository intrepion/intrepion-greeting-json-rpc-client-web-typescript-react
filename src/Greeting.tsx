function Greeting(props: { greeting: string }) {
  const { greeting } = props;
  return <p data-testid="greeting-test">{greeting}</p>;
}

export default Greeting;
