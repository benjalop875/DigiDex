import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DigimonService } from '../../../core/services/digimon.service';
import { Digimon, Pageable, DigimonQueryParams } from '../../../core/models/digimon.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, DecimalPipe, ReactiveFormsModule],
  templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
  private readonly digimonService = inject(DigimonService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  
  public digimons = signal<Digimon[]>([]);
  public loading = signal<boolean>(true);
  public pageable = signal<Pageable | null>(null);

  public filterForm = this.fb.group({
    name: [''],
    exact: [false],
    attribute: [''],
    xAntibody: [false],
    level: [''],
    pageSize: [20]
  });

  public currentPage = signal<number>(0);

  // Static options for filters
  public attributes = ['Data', 'Vaccine', 'Virus', 'Free', 'Variable', 'Unknown'];
  public levels = ['Baby', 'In-Training', 'Rookie', 'Champion', 'Ultimate', 'Mega', 'Armor'];

  public paginationRange = computed(() => {
    const pageInfo = this.pageable();
    if (!pageInfo) return [];
    
    const current = pageInfo.currentPage + 1; // 1-indexed for display
    const total = pageInfo.totalPages;
    const delta = 1; // numbers around current
    
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i == 1 || i == total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  });

  ngOnInit(): void {
    this.loadDigimons();
  }

  applyFilters(): void {
    this.currentPage.set(0); // Reset to first page when filtering
    this.loadDigimons();
  }

  changePage(newPage: number): void {
    const pageInfo = this.pageable();
    if (!pageInfo) return;

    if (newPage < 0 || newPage >= pageInfo.totalPages) {
      // Out of bounds -> redirect to 404
      this.router.navigate(['/404']);
      return;
    }

    this.currentPage.set(newPage);
    this.loadDigimons();
    
    // Scroll to the top of the page to see the new results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageJump(event: Event): void {
    const input = event.target as HTMLInputElement;
    const pageStr = input.value.trim();
    if (!pageStr) return;
    
    const pageNum = parseInt(pageStr, 10);
    if (!isNaN(pageNum)) {
      this.changePage(pageNum - 1);
    }
  }

  loadDigimons(): void {
    this.loading.set(true);
    
    const formValues = this.filterForm.value;
    const params: DigimonQueryParams = {
      page: this.currentPage(),
      pageSize: formValues.pageSize ?? 20
    };

    if (formValues.name) params.name = formValues.name;
    if (formValues.exact) params.exact = formValues.exact;
    if (formValues.attribute) params.attribute = formValues.attribute;
    if (formValues.xAntibody) params.xAntibody = formValues.xAntibody;
    if (formValues.level) params.level = formValues.level;

    this.digimonService.getDigimons(params).subscribe({
      next: (response) => {
        this.digimons.set(response.content);
        this.pageable.set(response.pageable);
        
        // Failsafe: if we filtered and the current page is beyond the new total
        if (this.currentPage() > 0 && response.pageable.totalPages > 0 && this.currentPage() >= response.pageable.totalPages) {
          this.currentPage.set(0);
          this.loadDigimons();
        }

        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error fetching digimons', error);
        this.digimons.set([]);
        this.pageable.set(null);
        this.loading.set(false);
      }
    });
  }
}

