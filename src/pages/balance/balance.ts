import {Component} from '@angular/core';

import {MenuController, NavController, LoadingController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';

import {ConfigProvider} from '../../providers/config/config.provider';
import {NemProvider} from '../../providers/nem/nem.provider';

import {TransferPage} from '../transfer/transfer';
import {LoginPage} from '../login/login';

@Component({
    selector: 'page-balance',
    templateUrl: 'balance.html'
})
export class BalancePage {
    selectedWallet: any;
    balance: any;
    selectedMosaic: any;

    constructor(public navCtrl: NavController, private nem: NemProvider, private loading: LoadingController, private menu: MenuController, private config: ConfigProvider, public translate: TranslateService) {

    }


    ionViewWillEnter() {
        this.menu.enable(true);

        this.getBalance(false);
    }

    /**
     * Retrieves current account owned mosaics  into this.balance
     * @param refresher  Ionic refresher or false, if called on View Enter
     */
    getBalance(refresher) {

        this.nem.getSelectedWallet().then(
            value => {

                if (!value) {
                    if (refresher) refresher.complete();
                    this.navCtrl.setRoot(LoginPage);
                }
                else {

                    let loader = this.loading.create({
                        content: "Please wait..."
                    });

                    if (!refresher) loader.present();

                    this.nem.getBalance(value.accounts[0].address, this.config.defaultNetwork()).then(
                        value => {
                            this.balance = value.data;
                            console.log(this.balance);
                            if (refresher) {
                                refresher.complete();
                            }
                            else{
                                loader.dismiss();
                            }
                        })
                }
            }
        )
    }

    /**
     * Moves to transfer, by default with mosaic selected
     */
    goToTransfer(){
        this.navCtrl.push(TransferPage, {
            selectedMosaic: this.selectedMosaic.mosaicId.namespaceId + ':' + this.selectedMosaic.mosaicId.name,
            quantity: this.selectedMosaic.quantity,
        });
    }
}
