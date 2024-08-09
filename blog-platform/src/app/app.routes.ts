import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { CreatePostComponent } from './create-post/create-post.component';
import { ArticleDetailsComponent } from './home/article-details/article-details.component';
import { AuthorArticlesComponent } from './author-articles/author-articles.component';
import { DraftsComponent } from './create-post/drafts/drafts.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component:HomeComponent
    },
    {
        path: 'login',
        component:LoginComponent
    },
    {
        path: 'signup',
        component:SignupComponent,        
    },
    {
        path: 'articles&authors',
        component:AuthorArticlesComponent,
        // canActivate: [AuthGuard]
    },
    {
        path: 'create-post',
        component:CreatePostComponent,
        // canActivate: [AuthGuard]
    },
    {
        path :'article/:id',
        component: ArticleDetailsComponent,
        // canActivate: [AuthGuard]
    },{
        path:'drafts',
        component: DraftsComponent,
        // canActivate: [AuthGuard]
    }

    // {
    //     path: 'articles',
    //     component:ArticlesComponent
    // },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

export class AppRoutingModule{}
