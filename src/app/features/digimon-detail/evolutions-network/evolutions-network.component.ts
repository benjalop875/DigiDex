import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface EvolutionNode {
  id: number;
  digimon: string;
  condition: string;
  image: string;
  url: string;
}

@Component({
  selector: 'app-evolutions-network',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evolutions-network.component.html',
  styleUrl: './evolutions-network.component.css'
})
export class EvolutionsNetworkComponent {
  @Input() currentDigimonName: string = '';
  @Input() currentDigimonImage: string = '';
  @Input() priorEvolutions: EvolutionNode[] = [];
  @Input() nextEvolutions: EvolutionNode[] = [];
  
  // Max evolutions shown before scroll/truncating
  @Input() maxEvosShown: number = 6;

  @Output() navigate = new EventEmitter<number>();
  @Output() navigateBack = new EventEmitter<void>();

  onNavigate(id: number): void {
    this.navigate.emit(id);
  }
}
