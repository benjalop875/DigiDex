import { Component, OnInit, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DigimonService } from '../../core/services/digimon.service';
import { DigimonDetail } from '../../core/models/digimon.model';

@Component({
  selector: 'app-digimon-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DigimonDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly digimonService = inject(DigimonService);
  private readonly platformId = inject(PLATFORM_ID);

  digimon = signal<DigimonDetail | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  selectedLanguage = signal<'en_us' | 'jap'>('en_us');

  description = computed(() => {
    const d = this.digimon();
    if (!d) return '';
    
    const targetLang = this.selectedLanguage();
    const exactMatch = d.descriptions.find(desc => desc.language === targetLang);
    
    if (exactMatch) {
      return exactMatch.description;
    }
    
    // Fallback
    const en = d.descriptions.find(desc => desc.language === 'en_us');
    return en ? en.description : (d.descriptions[0]?.description ?? 'No description available.');
  });

  // Max evolutions shown before scroll
  readonly maxEvosShown = 3;

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
    this.router.navigate(['/explorer']);
  }

  navigateTo(id: number): void {
    this.router.navigate(['/digimon', id]);
  }
}
