import { Component, OnInit   , HostListener} from '@angular/core';
import {DataService, Post} from '../data.service'
import { Observable, Subject, interval, timer } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';


@Component({
  selector: 'app-scroll1',
  templateUrl: './scroll1.component.html',
  styleUrls: ['./scroll1.component.css'],

})


export class Scroll1Component implements OnInit {

  longText = 'The test';
  title = 'creatinglyProject';
  ngOnInit(): void {
    this.startTimer();
  }
  visiblePosts: Post[] = [];
  loading = false;

  // bache size load
  private readonly batchSize = 40;
  // interval time disapear post
  private readonly intervalTime=2000;
  private readonly visibilityThreshold = 0.5;
  private destroySubject = new Subject<void>();

  constructor(private data :DataService) {
    this.loadPosts();
  }
  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.loading && this.isScrolledToBottom()) {
      this.loadPosts();
    }
  }

  private isScrolledToBottom(): boolean {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    return scrollPosition + windowHeight >= documentHeight - (windowHeight * this.visibilityThreshold);
  }

  private loadPosts(): void {
    this.loading = true;

    setTimeout(() => {
      const startIndex = this.visiblePosts.length;
      const endIndex = startIndex + this.batchSize;
      const newPosts = this.data.allPosts.slice(startIndex, endIndex);

      this.visiblePosts.push(...newPosts);
      this.loading = false;
    }, 1000); // Simulating an asynchronous API call
  }

  ngOnDestroy() {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  startTimer() {
    const timer$ = timer(0,this.intervalTime); 

    timer$
      .pipe( 
         takeUntil(this.destroySubject),
        )
      .subscribe(() => {

        for (let element of this.visiblePosts) {
          if(element.visible==true)
           {
             element.visible = false;
             break;
           }
       }
      });
  }


}

