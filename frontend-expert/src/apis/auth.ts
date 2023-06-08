import axios from 'axios';

export default async function signIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/token`, {
    username,
    password,
  });

  return data;
}
