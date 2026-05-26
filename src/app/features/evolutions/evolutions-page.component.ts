import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DigimonService } from '../../core/services/digimon.service';
import { DigimonDetail } from '../../core/models/digimon.model';
import { EvolutionsNetworkComponent } from '../digimon-detail/evolutions-network/evolutions-network.component';

@Component({
  selector: 'app-evolutions-page',
  standalone: true,
  imports: [CommonModule, EvolutionsNetworkComponent],
  templateUrl: './evolutions-page.component.html'
})
export class EvolutionsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly digimonService = inject(DigimonService);
  private readonly platformId = inject(PLATFORM_ID);

  digimon = signal<DigimonDetail | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadDigimon(id);
      }
    });
  }

  loadDigimon(id: string): void {
    this.loading.set(true);
    this.error.set(null);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.digimonService.getDigimonDetail(id).subscribe({
      next: (data) => {
        this.digimon.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Digimon not found in database.');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    const d = this.digimon();
    if (d) {
      this.router.navigate(['/digimon', d.id]);
    } else {
      this.router.navigate(['/explorer']);
    }
  }

  navigateTo(id: number): void {
    this.router.navigate(['/digimon', id, 'evolutions']);
  }
}
