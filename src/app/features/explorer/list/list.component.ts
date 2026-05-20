import { Component, OnInit, inject, signal, computed, HostListener, ElementRef } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DigimonService } from '../../../core/services/digimon.service';
import { Digimon, Pageable, DigimonQueryParams, DigiApiField } from '../../../core/models/digimon.model';

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
  private readonly eRef = inject(ElementRef);
  
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

  // Dynamic options from API
  public attributesList = signal<DigiApiField[]>([]);
  public levelsList = signal<DigiApiField[]>([]);

  // Dropdown States
  public isAttributeOpen = signal<boolean>(false);
  public isLevelOpen = signal<boolean>(false);

  // Tooltip State
  public activeTooltip = signal<{text: string, loading: boolean, top: number, left: number} | null>(null);
  private hoverTimeout: any;

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

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.isAttributeOpen.set(false);
      this.isLevelOpen.set(false);
    }
  }

  ngOnInit(): void {
    this.loadDigimons();
    this.loadFilterOptions();
  }

  loadFilterOptions(): void {
    this.digimonService.getAttributes().subscribe({
      next: (res) => this.attributesList.set(res)
    });
    this.digimonService.getLevels().subscribe({
      next: (res) => this.levelsList.set(res)
    });
  }

  // Dropdown UI Methods
  toggleAttributeDropdown(event?: Event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    this.isAttributeOpen.set(!this.isAttributeOpen());
    this.isLevelOpen.set(false);
  }

  toggleLevelDropdown(event?: Event) {
    if(event) { event.preventDefault(); event.stopPropagation(); }
    this.isLevelOpen.set(!this.isLevelOpen());
    this.isAttributeOpen.set(false);
  }

  selectAttribute(val: string) {
    this.filterForm.patchValue({attribute: val});
    this.isAttributeOpen.set(false);
    this.activeTooltip.set(null); // Fix: hide tooltip on selection
    this.applyFilters();
  }

  selectLevel(val: string) {
    this.filterForm.patchValue({level: val});
    this.isLevelOpen.set(false);
    this.activeTooltip.set(null); // Fix: hide tooltip on selection
    this.applyFilters();
  }

  // Tooltip Logic
  showTooltip(event: MouseEvent | TouchEvent, type: 'attribute' | 'level', id: number) {
    clearTimeout(this.hoverTimeout);
    
    const target = (event.currentTarget as HTMLElement);
    const rect = target.getBoundingClientRect();
    
    // Calculate initial positions
    let topPos = rect.top;
    let leftPos = rect.right + 10;
    
    // Prevent tooltip from going off the right edge of the screen
    // The tooltip is 256px wide (w-64) + 16px padding approx.
    if (leftPos + 260 > window.innerWidth) {
        // If it goes off-screen right, show it on the left side instead
        leftPos = rect.left - 260 - 10;
        // If it also goes off-screen left (e.g., small mobile screen), just center it horizontally
        if (leftPos < 0) {
            leftPos = (window.innerWidth - 260) / 2;
            topPos = rect.bottom + 20; // Put it below the button
        }
    }

    this.activeTooltip.set({ 
      text: '', 
      loading: true, 
      top: topPos, 
      left: leftPos 
    });

    if (type === 'attribute') {
      this.digimonService.getAttributeDescription(id).subscribe(res => {
        const text = typeof res === 'string' ? res : res.description;
        this.activeTooltip.update(t => t ? { ...t, text, loading: false } : null);
      });
    } else {
      this.digimonService.getLevelDescription(id).subscribe(res => {
         const text = typeof res === 'string' ? res : res.description;
         this.activeTooltip.update(t => t ? { ...t, text, loading: false } : null);
      });
    }
  }

  hideTooltip() {
    this.hoverTimeout = setTimeout(() => {
      this.activeTooltip.set(null);
    }, 150);
  }

  applyFilters(): void {
    this.currentPage.set(0); // Reset to first page when filtering
    this.loadDigimons();
  }

  changePage(newPage: number): void {
    const pageInfo = this.pageable();
    if (!pageInfo) return;

    if (newPage < 0 || newPage >= pageInfo.totalPages) {
      this.router.navigate(['/404']);
      return;
    }

    this.currentPage.set(newPage);
    this.loadDigimons();
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

