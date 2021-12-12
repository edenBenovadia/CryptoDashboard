import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { AddressTitleComponent } from './address-title/address-title.component';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';
import { BalanceTitleComponent } from './balance-title/balance-title.component';
import { FormsModule } from '@angular/forms';
import { TokensHoldingsComponent } from './tokens-holdings/tokens-holdings.component';
import { TokenRowComponent } from './token-row/token-row.component';
import { SortPipe } from './pipes/sort.pipe';


@NgModule({
  declarations: [
    AddressTitleComponent,
    DashboardContainerComponent,
    BalanceTitleComponent,
    TokensHoldingsComponent,
    TokenRowComponent,
    SortPipe,
  ],
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
  ],
})
export class DashboardModule { }
