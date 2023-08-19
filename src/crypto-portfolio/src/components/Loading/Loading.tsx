import { Center, Spinner, Text } from "@chakra-ui/react";

const Loading = (props: { text?: string }) => {
  const { text="Loading..." } = props;

  return (
    <Center mx="auto" flexDirection={"column"}>
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='brand.500'
        size="xl"
        mx="auto"
      />
      <Text textAlign={"center"}>{text}</Text>
    </Center>
  );
};

export default Loading;