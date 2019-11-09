import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { ChartComponent } from '../charts/charts.component';
import { PlantComponent } from '../plants/plants.component';


const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    
    {
        path: 'plants',
        component: PlantComponent
    },
    
    {
        path: 'charts',
        component: ChartComponent
    },
    
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
