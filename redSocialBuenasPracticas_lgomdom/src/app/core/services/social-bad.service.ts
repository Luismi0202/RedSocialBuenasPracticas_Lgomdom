import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { KpiService } from '../metrics/kpi.service';

export type Post = { userId: number; id: number; title: string; body: string; };
export type Comment = { postId: number; id: number; name: string; email: string; body: string; };

@Injectable({ providedIn: 'root' })
export class SocialBadService {
  constructor(private http: HttpClient, private kpi: KpiService) {}

  // Simple in-memory cache with TTL and request de-duplication.
  private postsCache$?: Observable<Post[]>;
  private commentsCache = new Map<number, Observable<Comment[]>>();
  private readonly ttlMs = 60_000; // align with KPI cacheTtlSeconds = 60

  // Invalidate all caches (used by Settings "Refresh").
  invalidateAll(): void {
    this.postsCache$ = undefined;
    this.commentsCache.clear();
  }

  // Invalidate a specific post comments cache key
  invalidateComments(postId: number): void {
    this.commentsCache.delete(postId);
  }

  getPosts(): Observable<Post[]> {
    if (!this.postsCache$) {
      this.kpi.incCacheMiss();
      // Start the HTTP only once; share result; auto-expire after TTL
      const request$ = of(null).pipe(
        tap(() => this.kpi.incHttp()),
        switchMap(() => this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts')),
        shareReplay({ bufferSize: 1, refCount: false, windowTime: this.ttlMs })
      );
      this.postsCache$ = request$;
      // Schedule a timer to allow reporting cache hits after first fetch
      // Consumers accessing before TTL expiry will count as cache hits below
    } else {
      this.kpi.incCacheHit();
    }
    return this.postsCache$;
  }

  getComments(postId: number): Observable<Comment[]> {
    const existing = this.commentsCache.get(postId);
    if (existing) {
      this.kpi.incCacheHit();
      return existing;
    }

    this.kpi.incCacheMiss();
    const request$ = of(null).pipe(
      tap(() => this.kpi.incHttp()),
      switchMap(() => this.http.get<Comment[]>(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)),
      shareReplay({ bufferSize: 1, refCount: false, windowTime: this.ttlMs })
    );
    this.commentsCache.set(postId, request$);
    return request$;
  }
}
