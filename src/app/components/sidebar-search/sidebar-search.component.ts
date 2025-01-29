import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {MENU} from '@modules/main/menu-sidebar/menu-sidebar.component';
// import {PfDropdown} from '@profabric/angular-components';

@Component({
  selector: 'app-sidebar-search',
  imports: [],
  templateUrl: './sidebar-search.component.html',
  styleUrl: './sidebar-search.component.scss'
})
export class SidebarSearchComponent implements OnInit {
  public searchText: string = '';
  public foundMenuItems: { path: any; name: string; children: any; }[] = [];
  // @ViewChild('dropdown') dropdown: PfDropdown;

  constructor() {}

  ngOnInit(): void {}

  handleSearchTextChange(event: any) {
      this.foundMenuItems = [];

      if (event.target.value) {
          this.searchText = event.target.value;
          this.findMenuItems(MENU);
          return;
      } else {
          this.searchText = '';
          // this.dropdown.isOpen = false;
      }
  }

  handleIconClick() {
      this.searchText = '';
      // this.dropdown.isOpen = false;
  }

  handleMenuItemClick() {
      this.searchText = '';
      // this.dropdown.isOpen = false;
  }

  findMenuItems(menu: any) {
      if (!this.searchText) {
          return;
      }

      menu.forEach((menuItem: { path: any; name: string; children: any; }) => {
          if (
              menuItem.path &&
              menuItem.name
                  .toLowerCase()
                  .includes(this.searchText.toLowerCase())
          ) {
              this.foundMenuItems.push(menuItem);
          }
          if (menuItem.children) {
              return this.findMenuItems(menuItem.children);
          }
      });

      if (this.foundMenuItems.length > 0) {
          // this.dropdown.isOpen = true;
      }
  }

  boldString(str: string, substr: any) {
      return str.replaceAll(
          this.capitalizeFirstLetter(substr),
          `<strong class="text-light">${this.capitalizeFirstLetter(
              substr
          )}</strong>`
      );
  }

  capitalizeFirstLetter(string: any) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

