// import { PositiveNumber } from './pipes/positive-amount.pipe';
// import { NgModule } from '@angular/core';
// import { StorageModule } from './storage';
// import { AuthTokenModule } from './auth-token';
// import { AuthModule } from './auth';
// import { CoreComponentModule } from './components/core-components.module';
// import { AmountFormatterPipe } from './pipes/amount-formatter.pipe';
// import { ParseDatePipe, ParseMonthPipe, TimeAgoPipe } from './pipes/parse-date.pipe';
// import { CheckScriptsPipe } from './pipes/safe-web-content.pipe';
// import { SortableDirective } from './directives/sortable.directive';
// import { TranslationService } from './translator';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpClient } from '@angular/common/http';
// import { DrewlabsDisableControlDirective } from './directives/disable-control.directive';
// import { FormHelperService } from './helpers/form-helper';
// import { TypeUtilHelper } from './helpers/type-utils-helper';
// import { TranslatorHelperService } from './helpers/translator-helper';
// import { FileHelperService } from './helpers/file-helper.service';
// import { DateTimeHelper } from './helpers/date-time-helper';
// import { MonthParserPipe } from './pipes/month-parser.pipe';
// import { DatagridHeaderModule } from './components/datgrid-header/datagrid-header.module';

// AoT requires an exported function for factories
// export function HttpLoaderFactory(httpClient: HttpClient) {
//   return new TranslateHttpLoader(httpClient, '../../../assets/i18n/', '.json');
// }

// @NgModule({
//   imports: [
//     StorageModule.forRoot(),
//     AuthTokenModule.forRoot({

//     }),
//     AppHttpModule.forRoot(),
//     AuthModule.forRoot(),
//     CoreComponentModule.forRoot(),
//     TranslateModule,
//     DatagridHeaderModule,
//     PipesModule
//   ],
//   exports: [
//     StorageModule,
//     AuthTokenModule,
//     AppHttpModule,
//     AuthModule,
//     CoreComponentModule,
//     SortableDirective,
//     TranslateModule,
//     DrewlabsDisableControlDirective,
//     DatagridHeaderModule,
//     PipesModule
//   ],
//   declarations: [
//     SortableDirective,
//     DrewlabsDisableControlDirective,
//   ],
//   providers: [
//     TranslationService,
//     FormHelperService,
//     TypeUtilHelper,
//     TranslatorHelperService,
//     FileHelperService,
//     DateTimeHelper
//   ]
// })
// export class DomainModule {}

// @NgModule({
//   imports: [
//     TranslateModule.forRoot({
//       loader: {
//         provide: TranslateLoader,
//         useFactory: HttpLoaderFactory,
//         deps: [HttpClient]
//       }
//     })
//   ]
// })
// export class ApplicationTranslationModule {}
