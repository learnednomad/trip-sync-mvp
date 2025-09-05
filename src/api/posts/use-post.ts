import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client, withDisplayName } from '../common';
import type { Post } from './types';

type Variables = { id: string };
type Response = Post;

export const usePost = withDisplayName(
  createQuery<Response, Variables, AxiosError>({
    queryKey: ['posts'],
    fetcher: (variables) => {
      return client
        .get(`posts/${variables.id}`)
        .then((response) => response.data);
    },
  }),
  'usePost'
);
