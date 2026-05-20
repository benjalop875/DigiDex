import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigimonService } from '../../core/services/digimon.service';
import { Pageable, DigiApiField } from '../../core/models/digimon.model';

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './types.component.html',
})
export class TypesComponent implements OnInit {
  private digimonService = inject(DigimonService);

  types = signal<DigiApiField[]>([]);
  pageable = signal<Pageable | null>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadTypes(0);
  }

  loadTypes(page: number) {
    this.loading.set(true);
    this.digimonService.getTypes(page).subscribe({
      next: (res) => {
        this.pageable.set(res.pageable);
        this.types.set(res.content.fields);
        this.loading.set(false);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: () => this.loading.set(false)
    });
  }

  // --- Pagination Logic (same as Explorer & Skills) ---
  paginationRange = computed(() => {
    const pageInfo = this.pageable();
    if (!pageInfo) return [];

    const current = pageInfo.currentPage + 1;
    const total = pageInfo.totalPages;
    const delta = 2;

    const range: (number | string)[] = [];
    
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || 
        i === total || 
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      } else if (
        i === current - delta - 1 || 
        i === current + delta + 1
      ) {
        range.push('...');
      }
    }
    return range;
  });

  changePage(page: number) {
    const pageInfo = this.pageable();
    if (pageInfo && page >= 0 && page < pageInfo.totalPages && page !== pageInfo.currentPage) {
      this.loadTypes(page);
    }
  }

  onPageJump(event: Event) {
    const target = event.target as HTMLInputElement;
    const pageInfo = this.pageable();
    if (target.value && pageInfo) {
      let newPage = parseInt(target.value, 10);
      if (newPage < 1) newPage = 1;
      if (newPage > pageInfo.totalPages) newPage = pageInfo.totalPages;
      
      if (newPage - 1 !== pageInfo.currentPage) {
        this.changePage(newPage - 1);
      }
    }
  }
}
