import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArticleState } from '../reducers/article.reducer';

export const selectArticleState = createFeatureSelector<ArticleState>('articles');

export const selectAllArticles = createSelector(
  selectArticleState,
  (state: ArticleState) => state.article
);

export const selectArticlesLoading = createSelector(
  selectArticleState,
  (state: ArticleState) => state.loading
);

export const selectArticlesError = createSelector(
  selectArticleState,
  (state: ArticleState) => state.error
);


export const selectFeaturedArticles = createSelector(
  selectArticleState,
  (state: ArticleState) => {
    console.log(state)
    return state.article.filter(article => article.featured)}
);
