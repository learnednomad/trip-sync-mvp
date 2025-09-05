import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client, withDisplayName } from '../common';
import type { Post } from './types';

type Variables = { title: string; body: string; userId: number };
type Response = Post;

export const useAddPost = withDisplayName(
  createMutation<Response, Variables, AxiosError>({
    mutationFn: async (variables) =>
      client({
        url: 'posts/add',
        method: 'POST',
        data: variables,
      }).then((response) => response.data),
  }),
  'useAddPost'
);
