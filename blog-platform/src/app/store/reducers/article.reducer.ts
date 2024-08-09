import { createReducer, on } from '@ngrx/store';
import { Article } from '../../services/articles.service';
import { loadArticles, loadArticlesFailure, loadArticlesSuccess } from '../actions/article.action';

export interface ArticleState {
  article: Article[];
  loading: boolean;
  error: any;
}

export const initialState: ArticleState = {
  article: [],
  loading: false,
  error: null
};

export const articleReducer = createReducer(
  initialState,
  on(loadArticles, state => ({ ...state, loading: true })),
  on(loadArticlesSuccess, (state, { article }) => ({ ...state, loading: false, article })),
  on(loadArticlesFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
