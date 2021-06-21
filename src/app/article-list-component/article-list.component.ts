import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from 'src/@root/confirm-dialog/confirm-dialog.component';
import { Article, ArticleTypes } from 'src/models/article.model';
import { ArticleService } from 'src/services/article/article.service';
import { AuthService } from 'src/services/AuthService';
import { MemberService } from 'src/services/member/member.service';
import { ArticleFormComponent } from '../article-form-component/article-form.component';
import { Member } from 'src/models/member.model';
@Component({
  templateUrl: './article-list.component.html'
})
export class ArticleListComponent implements OnInit {

  source: MatTableDataSource<Article> = new MatTableDataSource();

  isReady = false;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;

  currentUser = this.authService.currentUserState;
  members: Member[] = [];
  displayedColumns: string[] = ['ID', 'Title', 'Type', 'Author Name', 'Contributers', 'Appearance Date', 'Link', 'Pdf Source', 'Actions'];

  constructor(
    private memberService: MemberService,
    private articleService: ArticleService,
    private authService: AuthService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  getType(type: "NEWSPAPER_ARTICLE" | "BOOK" | "BOOK_CHAPTER" | "POST") {
    return ArticleTypes[type];
  }

  getMemberFullName(memberId: string): string {
    const member = this.members.find(item => item.id === memberId);
    return (member?.surname || '') + ' ' + (member?.name || '')
  }

  openDialog(action: 'ADD' | 'EDIT' | 'DELETE', id?: string) {
    if (action === 'DELETE') {
      this.dialog.open(ConfirmDialogComponent, {
      }).afterClosed().pipe().subscribe(isDeleteConfirmed => {
        if (isDeleteConfirmed && id) {
          this.articleService.delete(id).then(() => this.fetchData());
        }
      });
    } else {
      this.dialog.open(ArticleFormComponent, {
        width: '80%',
        ...{ data: id }
      }).afterClosed().subscribe((results: "ERROR" | "SUCCESS") => {
        this.fetchData();
        switch (results) {
          case "SUCCESS":
            this._snackBar.open("Article a été modifié avec succès.", "Ok", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
              panelClass: 'snack-color-validate'
            });
            break;
          case "ERROR":
            this._snackBar.open("Une erreur inattendue s'est produite.", "Ok", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: this.durationInSeconds * 1000,
              panelClass: 'snack-color-validate'
            });
            break;
          default:
            break;
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.source.filter = filterValue.trim().toLowerCase();
  }

  private fetchData(): void {
    this.articleService.getAll().then(articles => {
      this.memberService.getAll().then(members => {
        this.source.data = articles
          .map(article => ({
            ...article,
            author: members.find(member => member.id === article.author_id)
          }));
        console.log(articles)
        this.isReady = true;
      })
    });
  }

}
