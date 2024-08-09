import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  public modalTitle: BehaviorSubject<string> = new BehaviorSubject('');
  public modalMessage: BehaviorSubject<string> = new BehaviorSubject('');
  public newlyaddedData: BehaviorSubject<any> = new BehaviorSubject([]);
  public blogData: BehaviorSubject<any> = new BehaviorSubject([]);
  public fromRelatedArticles: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
  public fromReadersChoice: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );
}
