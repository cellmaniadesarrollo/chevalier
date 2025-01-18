import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrl: './team-members.component.css'
})
export class TeamMembersComponent {
  teamMembers = [
    {
      name: 'Ana González',
      specialty: 'Experta en tratamientos capilares',
      bio: 'Ana es conocida por su habilidad en tratamientos capilares y cuidado del cabello.',
      photo: 'img/team/1.jpg'
    },
    {
      name: 'Juan Pérez',
      specialty: 'Especialista en cortes modernos',
      bio: 'Con más de 10 años de experiencia en barbería, Juan es un experto en crear looks modernos y a la moda.',
      photo: 'img/team/2.jpg'
    },
    {
      name: 'Javier Mujica',
      specialty: 'Especialista en cortes de diseño, barba, tinturados y permanente',
      bio: 'Con 3 años de experiencia en barbería, Javier se destaca por su habilidad para crear cortes innovadores y personalizados, siempre buscando nuevas formas de estilizar el cabello y la barba con un toque creativo.',
      photo: 'img/team/3.jpg'
    },
    {
      name: 'Adrian Piña',
      specialty: 'Especialista en cortes freestyle, barba y tinturados',
      bio: 'Con 9 años de experiencia, Adrián es un verdadero artista del cabello. Se especializa en cortes freestyle y tinturados, creando estilos únicos que reflejan las últimas tendencias y la personalidad de cada cliente.',
      photo: 'img/team/4.jpg'
    }
  ];
}
