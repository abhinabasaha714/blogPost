import { createAction, props } from '@ngrx/store';
import { Article } from '../../services/articles.service';

export const loadArticles = createAction('[Article List] Load Articles');
export const loadArticlesSuccess = createAction('[Article List] Load Articles Success', props<{ article: Article[] }>());
export const loadArticlesFailure = createAction('[Article List] Load Articles Failure', props<{ error: string }>());

