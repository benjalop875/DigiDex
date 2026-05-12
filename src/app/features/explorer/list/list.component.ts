import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

  ngOnInit(): void {
    this.loadDigimons();
  }

  applyFilters(): void {
    this.currentPage.set(0); // Reset to first page when filtering
    this.loadDigimons();
  }

  changePage(newPage: number): void {
    this.currentPage.set(newPage);
    this.loadDigimons();
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


