import axios from 'axios';

const auth = {
  signIn: async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const formData = new FormData();

    formData.append('username', username);
    formData.append('password', password);

    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/token`,
      formData,
    );

    return data;
  },
};

export default auth;
